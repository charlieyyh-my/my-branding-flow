import { createClient, isConfigured } from "@/lib/supabase/server";
import type {
  AuditLog,
  Campaign,
  ContentItem,
  BrandGuideline,
  LeadEnquiry,
  MarketingAsset,
  SeoKeyword,
  SocialPerformance,
  WeeklyTheme,
} from "@/lib/types";

export interface QueryResult<T> {
  data: T;
  error: string | null;
  configured: boolean;
}

async function runList<T>(
  table: string,
  build: (q: any) => any,
): Promise<QueryResult<T[]>> {
  if (!isConfigured()) {
    return { data: [], error: null, configured: false };
  }
  try {
    const supabase = await createClient();
    if (!supabase) return { data: [], error: null, configured: false };
    const { data, error } = await build(supabase.from(table).select("*"));
    if (error) return { data: [], error: error.message, configured: true };
    return { data: (data ?? []) as T[], error: null, configured: true };
  } catch (e) {
    return {
      data: [],
      error: e instanceof Error ? e.message : "Unknown error",
      configured: true,
    };
  }
}

async function runSingle<T>(
  table: string,
  id: string,
): Promise<QueryResult<T | null>> {
  if (!isConfigured()) {
    return { data: null, error: null, configured: false };
  }
  try {
    const supabase = await createClient();
    if (!supabase) return { data: null, error: null, configured: false };
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return { data: null, error: error.message, configured: true };
    return { data: (data ?? null) as T | null, error: null, configured: true };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : "Unknown error",
      configured: true,
    };
  }
}

export const getCampaigns = () =>
  runList<Campaign>("campaigns", (q) => q.order("created_at", { ascending: true }));

export const getCampaign = (id: string) => runSingle<Campaign>("campaigns", id);

export const getWeeklyThemes = () =>
  runList<WeeklyTheme>("weekly_themes", (q) =>
    q.order("week_start", { ascending: true }),
  );

export const getWeeklyTheme = (id: string) =>
  runSingle<WeeklyTheme>("weekly_themes", id);

export const getContentItems = () =>
  runList<ContentItem>("content_items", (q) =>
    q.order("scheduled_date", { ascending: true, nullsFirst: false }),
  );

export const getContentItem = (id: string) =>
  runSingle<ContentItem>("content_items", id);

export const getMarketingAssets = () =>
  runList<MarketingAsset>("marketing_assets", (q) =>
    q.order("created_at", { ascending: true }),
  );

export const getSeoKeywords = () =>
  runList<SeoKeyword>("seo_keywords", (q) =>
    q.order("created_at", { ascending: true }),
  );

export const getBrandGuidelines = () =>
  runList<BrandGuideline>("brand_guidelines", (q) =>
    q.order("display_order", { ascending: true }),
  );

export const getLeads = () =>
  runList<LeadEnquiry>("leads_enquiries", (q) =>
    q.order("created_at", { ascending: false }),
  );

export const getLead = (id: string) =>
  runSingle<LeadEnquiry>("leads_enquiries", id);

export const getSocialPerformance = () =>
  runList<SocialPerformance>("social_performance", (q) =>
    q.order("recorded_date", { ascending: false, nullsFirst: false }),
  );

export const getAuditLogs = () =>
  runList<AuditLog>("audit_logs", (q) =>
    q.order("created_at", { ascending: false }).limit(50),
  );
