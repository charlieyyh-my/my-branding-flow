"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Default actor for v1 (no login). Replaced by auth.uid() email at lock-down.
const ACTOR = "demo@centurymarkpacific.com";

export interface ActionState {
  error?: string;
  ok?: boolean;
}

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function num(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

async function client() {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error(
      "Database is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (run `vercel env pull .env.local`).",
    );
  }
  return supabase;
}

async function writeAudit(entry: {
  action: string;
  object_type: string;
  object_id: string;
  old_value?: unknown;
  new_value?: unknown;
  risk_level?: string;
}) {
  try {
    const supabase = await createClient();
    if (!supabase) return;
    await supabase.from("audit_logs").insert({
      actor: ACTOR,
      action: entry.action,
      object_type: entry.object_type,
      object_id: entry.object_id,
      old_value: entry.old_value ?? null,
      new_value: entry.new_value ?? null,
      risk_level: entry.risk_level ?? "low",
    });
  } catch {
    // Audit is best-effort; never block the primary mutation.
  }
}

/* ─────────────────────────── Content items ─────────────────────────── */

function contentPayload(fd: FormData) {
  return {
    title: str(fd, "title"),
    platform: str(fd, "platform"),
    copy_body: str(fd, "copy_body"),
    visual_notes: str(fd, "visual_notes"),
    scheduled_date: str(fd, "scheduled_date"),
    scheduled_time: str(fd, "scheduled_time"),
    status: str(fd, "status") ?? "draft",
    campaign_id: str(fd, "campaign_id"),
    weekly_theme_id: str(fd, "weekly_theme_id"),
    assigned_to: str(fd, "assigned_to"),
    published_url: str(fd, "published_url"),
  };
}

export async function createContentItem(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const payload = contentPayload(fd);
  if (!payload.title) return { error: "Title is required." };
  if (!payload.platform) return { error: "Platform is required." };

  let newId: string;
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("content_items")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message };
    newId = data.id as string;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create." };
  }

  await writeAudit({
    action: "content_created",
    object_type: "content_item",
    object_id: newId,
    new_value: { title: payload.title, status: payload.status },
  });
  revalidatePath("/content");
  revalidatePath("/calendar");
  revalidatePath("/");
  redirect(`/content/${newId}`);
}

export async function updateContentItem(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  if (!id) return { error: "Missing id." };
  const payload = contentPayload(fd);
  if (!payload.title) return { error: "Title is required." };
  if (!payload.platform) return { error: "Platform is required." };

  try {
    const supabase = await client();
    const { data: before } = await supabase
      .from("content_items")
      .select("status")
      .eq("id", id)
      .maybeSingle();
    const { error } = await supabase
      .from("content_items")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };

    if (before && before.status !== payload.status) {
      await writeAudit({
        action: "status_changed",
        object_type: "content_item",
        object_id: id,
        old_value: { status: before.status },
        new_value: { status: payload.status },
        risk_level: payload.status === "published" ? "medium" : "low",
      });
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update." };
  }

  revalidatePath("/content");
  revalidatePath(`/content/${id}`);
  revalidatePath("/calendar");
  revalidatePath("/");
  return { ok: true };
}

export async function setContentStatus(fd: FormData) {
  const id = str(fd, "id");
  const status = str(fd, "status");
  if (!id || !status) return;
  const published_url = str(fd, "published_url");

  const supabase = await client();
  const { data: before } = await supabase
    .from("content_items")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  const update: Record<string, unknown> = { status };
  if (published_url) update.published_url = published_url;

  const { error } = await supabase
    .from("content_items")
    .update(update)
    .eq("id", id);
  if (error) throw new Error(error.message);

  await writeAudit({
    action: "status_changed",
    object_type: "content_item",
    object_id: id,
    old_value: { status: before?.status ?? null },
    new_value: { status },
    risk_level: status === "published" ? "medium" : "low",
  });

  revalidatePath("/content");
  revalidatePath(`/content/${id}`);
  revalidatePath("/calendar");
  revalidatePath("/");
}

export async function deleteContentItem(fd: FormData) {
  const id = str(fd, "id");
  if (!id) return;
  const supabase = await client();
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await writeAudit({
    action: "content_deleted",
    object_type: "content_item",
    object_id: id,
    risk_level: "high",
  });
  revalidatePath("/content");
  revalidatePath("/calendar");
  revalidatePath("/");
  redirect("/content");
}

/* ─────────────────────────── Campaigns ─────────────────────────── */

function campaignPayload(fd: FormData) {
  return {
    name: str(fd, "name"),
    objective: str(fd, "objective"),
    start_date: str(fd, "start_date"),
    end_date: str(fd, "end_date"),
    status: str(fd, "status") ?? "planned",
  };
}

export async function createCampaign(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const payload = campaignPayload(fd);
  if (!payload.name) return { error: "Campaign name is required." };
  let newId: string;
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("campaigns")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message };
    newId = data.id as string;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create." };
  }
  await writeAudit({
    action: "campaign_created",
    object_type: "campaign",
    object_id: newId,
    new_value: { name: payload.name },
  });
  revalidatePath("/campaigns");
  revalidatePath("/");
  redirect("/campaigns");
}

export async function updateCampaign(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  if (!id) return { error: "Missing id." };
  const payload = campaignPayload(fd);
  if (!payload.name) return { error: "Campaign name is required." };
  try {
    const supabase = await client();
    const { error } = await supabase
      .from("campaigns")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update." };
  }
  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${id}`);
  revalidatePath("/");
  redirect("/campaigns");
}

export async function deleteCampaign(fd: FormData) {
  const id = str(fd, "id");
  if (!id) return;
  const supabase = await client();
  // Null out references so the delete isn't blocked by FKs.
  await supabase
    .from("content_items")
    .update({ campaign_id: null })
    .eq("campaign_id", id);
  await supabase
    .from("weekly_themes")
    .update({ campaign_id: null })
    .eq("campaign_id", id);
  await supabase
    .from("marketing_assets")
    .update({ campaign_id: null })
    .eq("campaign_id", id);
  const { error } = await supabase.from("campaigns").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await writeAudit({
    action: "campaign_deleted",
    object_type: "campaign",
    object_id: id,
    risk_level: "critical",
  });
  revalidatePath("/campaigns");
  revalidatePath("/");
  redirect("/campaigns");
}

/* ─────────────────────────── Weekly themes ─────────────────────────── */

function themePayload(fd: FormData) {
  return {
    theme_name: str(fd, "theme_name"),
    week_start: str(fd, "week_start"),
    guiding_message: str(fd, "guiding_message"),
    campaign_id: str(fd, "campaign_id"),
  };
}

export async function createTheme(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const payload = themePayload(fd);
  if (!payload.theme_name) return { error: "Theme name is required." };
  if (!payload.week_start) return { error: "Week start date is required." };
  try {
    const supabase = await client();
    const { error } = await supabase.from("weekly_themes").insert(payload);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create." };
  }
  revalidatePath("/themes");
  redirect("/themes");
}

export async function updateTheme(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  if (!id) return { error: "Missing id." };
  const payload = themePayload(fd);
  if (!payload.theme_name) return { error: "Theme name is required." };
  if (!payload.week_start) return { error: "Week start date is required." };
  try {
    const supabase = await client();
    const { error } = await supabase
      .from("weekly_themes")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update." };
  }
  revalidatePath("/themes");
  redirect("/themes");
}

export async function deleteTheme(fd: FormData) {
  const id = str(fd, "id");
  if (!id) return;
  const supabase = await client();
  await supabase
    .from("content_items")
    .update({ weekly_theme_id: null })
    .eq("weekly_theme_id", id);
  const { error } = await supabase.from("weekly_themes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/themes");
  redirect("/themes");
}

/* ─────────────────────────── Marketing assets ─────────────────────────── */

function assetPayload(fd: FormData) {
  return {
    name: str(fd, "name"),
    asset_type: str(fd, "asset_type"),
    file_url: str(fd, "file_url"),
    campaign_id: str(fd, "campaign_id"),
    usage_notes: str(fd, "usage_notes"),
    tags: str(fd, "tags"),
  };
}

export async function createAsset(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const payload = assetPayload(fd);
  if (!payload.name) return { error: "Asset name is required." };
  if (!payload.file_url) return { error: "File URL is required." };
  try {
    const supabase = await client();
    const { error } = await supabase.from("marketing_assets").insert(payload);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create." };
  }
  revalidatePath("/assets");
  redirect("/assets");
}

export async function updateAsset(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  if (!id) return { error: "Missing id." };
  const payload = assetPayload(fd);
  if (!payload.name) return { error: "Asset name is required." };
  if (!payload.file_url) return { error: "File URL is required." };
  try {
    const supabase = await client();
    const { error } = await supabase
      .from("marketing_assets")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update." };
  }
  revalidatePath("/assets");
  redirect("/assets");
}

export async function deleteAsset(fd: FormData) {
  const id = str(fd, "id");
  if (!id) return;
  const supabase = await client();
  const { error } = await supabase.from("marketing_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/assets");
  redirect("/assets");
}

/* ─────────────────────────── SEO keywords ─────────────────────────── */

function keywordPayload(fd: FormData) {
  return {
    keyword: str(fd, "keyword"),
    category: str(fd, "category"),
    priority: str(fd, "priority") ?? "medium",
    target_url: str(fd, "target_url"),
    notes: str(fd, "notes"),
  };
}

export async function createKeyword(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const payload = keywordPayload(fd);
  if (!payload.keyword) return { error: "Keyword is required." };
  try {
    const supabase = await client();
    const { error } = await supabase.from("seo_keywords").insert(payload);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create." };
  }
  revalidatePath("/keywords");
  redirect("/keywords");
}

export async function updateKeyword(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  if (!id) return { error: "Missing id." };
  const payload = keywordPayload(fd);
  if (!payload.keyword) return { error: "Keyword is required." };
  try {
    const supabase = await client();
    const { error } = await supabase
      .from("seo_keywords")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update." };
  }
  revalidatePath("/keywords");
  redirect("/keywords");
}

export async function deleteKeyword(fd: FormData) {
  const id = str(fd, "id");
  if (!id) return;
  const supabase = await client();
  const { error } = await supabase.from("seo_keywords").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/keywords");
  redirect("/keywords");
}

/* ─────────────────────────── Leads & enquiries ─────────────────────────── */

function leadPayload(fd: FormData) {
  return {
    contact_name: str(fd, "contact_name"),
    company: str(fd, "company"),
    enquiry_type: str(fd, "enquiry_type"),
    source: str(fd, "source"),
    status: str(fd, "status") ?? "new",
    notes: str(fd, "notes"),
    follow_up_date: str(fd, "follow_up_date"),
  };
}

export async function createLead(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const payload = leadPayload(fd);
  if (!payload.contact_name) return { error: "Contact name is required." };
  let newId: string;
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("leads_enquiries")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message };
    newId = data.id as string;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create." };
  }
  await writeAudit({
    action: "lead_created",
    object_type: "lead_enquiry",
    object_id: newId,
    new_value: { contact_name: payload.contact_name, status: payload.status },
  });
  revalidatePath("/leads");
  revalidatePath("/");
  redirect("/leads");
}

export async function updateLead(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  if (!id) return { error: "Missing id." };
  const payload = leadPayload(fd);
  if (!payload.contact_name) return { error: "Contact name is required." };
  try {
    const supabase = await client();
    const { data: before } = await supabase
      .from("leads_enquiries")
      .select("status")
      .eq("id", id)
      .maybeSingle();
    const { error } = await supabase
      .from("leads_enquiries")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
    if (before && before.status !== payload.status) {
      await writeAudit({
        action: "lead_status_changed",
        object_type: "lead_enquiry",
        object_id: id,
        old_value: { status: before.status },
        new_value: { status: payload.status },
      });
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update." };
  }
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  revalidatePath("/");
  return { ok: true };
}

export async function setLeadStatus(fd: FormData) {
  const id = str(fd, "id");
  const status = str(fd, "status");
  if (!id || !status) return;
  const supabase = await client();
  const { data: before } = await supabase
    .from("leads_enquiries")
    .select("status")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase
    .from("leads_enquiries")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  await writeAudit({
    action: "lead_status_changed",
    object_type: "lead_enquiry",
    object_id: id,
    old_value: { status: before?.status ?? null },
    new_value: { status },
  });
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  revalidatePath("/");
}

export async function deleteLead(fd: FormData) {
  const id = str(fd, "id");
  if (!id) return;
  const supabase = await client();
  const { error } = await supabase.from("leads_enquiries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await writeAudit({
    action: "lead_deleted",
    object_type: "lead_enquiry",
    object_id: id,
    risk_level: "high",
  });
  revalidatePath("/leads");
  revalidatePath("/");
  redirect("/leads");
}

/* ─────────────────────────── Brand guidelines ─────────────────────────── */

function guidelinePayload(fd: FormData) {
  return {
    section_title: str(fd, "section_title"),
    content: str(fd, "content"),
    display_order: num(fd, "display_order") ?? 0,
  };
}

export async function createGuideline(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const payload = guidelinePayload(fd);
  if (!payload.section_title) return { error: "Section title is required." };
  try {
    const supabase = await client();
    const { error } = await supabase.from("brand_guidelines").insert(payload);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create." };
  }
  await writeAudit({
    action: "guideline_created",
    object_type: "brand_guideline",
    object_id: "n/a",
    new_value: { section_title: payload.section_title },
    risk_level: "medium",
  });
  revalidatePath("/guidelines");
  redirect("/guidelines");
}

export async function updateGuideline(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const id = str(fd, "id");
  if (!id) return { error: "Missing id." };
  const payload = guidelinePayload(fd);
  if (!payload.section_title) return { error: "Section title is required." };
  try {
    const supabase = await client();
    const { error } = await supabase
      .from("brand_guidelines")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update." };
  }
  await writeAudit({
    action: "guideline_updated",
    object_type: "brand_guideline",
    object_id: id,
    new_value: { section_title: payload.section_title },
    risk_level: "medium",
  });
  revalidatePath("/guidelines");
  redirect("/guidelines");
}

export async function deleteGuideline(fd: FormData) {
  const id = str(fd, "id");
  if (!id) return;
  const supabase = await client();
  const { error } = await supabase.from("brand_guidelines").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/guidelines");
  redirect("/guidelines");
}

/* ─────────────────────────── Social performance ─────────────────────────── */

export async function createPerformance(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const content_item_id = str(fd, "content_item_id");
  if (!content_item_id) return { error: "Content item is required." };
  const payload = {
    content_item_id,
    platform: str(fd, "platform"),
    reach: num(fd, "reach") ?? 0,
    impressions: num(fd, "impressions") ?? 0,
    clicks: num(fd, "clicks") ?? 0,
    enquiries_generated: num(fd, "enquiries_generated") ?? 0,
    recorded_date: str(fd, "recorded_date"),
  };
  try {
    const supabase = await client();
    const { error } = await supabase.from("social_performance").insert(payload);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create." };
  }
  revalidatePath(`/content/${content_item_id}`);
  return { ok: true };
}
