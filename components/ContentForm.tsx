"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ActionState } from "@/lib/actions";
import type { Campaign, ContentItem, WeeklyTheme } from "@/lib/types";
import { PLATFORMS, CONTENT_STATUSES } from "@/lib/types";
import { label } from "@/lib/format";
import { SubmitButton } from "@/components/SubmitButton";
import { FieldError } from "@/components/ui";
import { toast } from "@/components/Toast";

export function ContentForm({
  action,
  campaigns,
  themes,
  item,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  campaigns: Campaign[];
  themes: WeeklyTheme[];
  item?: ContentItem;
}) {
  const [state, formAction] = useActionState(action, {});
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // Controlled so the AI draft can populate the copy field.
  const [copy, setCopy] = useState(item?.copy_body ?? "");
  const [aiPending, setAiPending] = useState(false);

  // On successful edit (no redirect), refresh so server data re-renders.
  useEffect(() => {
    if (state.ok) {
      toast("Changes saved");
      router.refresh();
    }
  }, [state.ok, router]);

  async function draftWithAI() {
    const fd = new FormData(formRef.current ?? undefined);
    setAiPending(true);
    try {
      const res = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: fd.get("title") ?? "",
          platform: fd.get("platform") ?? "Instagram",
          brief: fd.get("copy_body") ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "AI draft failed");
        return;
      }
      setCopy(data.caption);
      toast("Caption drafted ✨ — review and edit before saving");
    } catch {
      toast("Couldn’t reach the AI service");
    } finally {
      setAiPending(false);
    }
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <FieldError message={state.error} />
      {state.ok ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Saved.
        </div>
      ) : null}

      <div>
        <label className="field-label" htmlFor="title">
          Title *
        </label>
        <input
          id="title"
          name="title"
          className="field"
          defaultValue={item?.title ?? ""}
          placeholder="e.g. Why Authorised Matters — Instagram Carousel"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="platform">
            Platform *
          </label>
          <select
            id="platform"
            name="platform"
            className="field"
            defaultValue={item?.platform ?? "Instagram"}
            required
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="field"
            defaultValue={item?.status ?? "draft"}
          >
            {CONTENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label className="field-label mb-0" htmlFor="copy_body">
            Copy
          </label>
          <button
            type="button"
            onClick={draftWithAI}
            disabled={aiPending}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-gold)] px-3 py-1 text-xs font-semibold text-[var(--brand-gold)] transition hover:bg-[var(--brand-gold)]/10 disabled:opacity-60"
            title="Draft a caption with AI from the title, channel, and any notes above"
          >
            {aiPending ? "Drafting…" : "✨ Draft with AI"}
          </button>
        </div>
        <textarea
          id="copy_body"
          name="copy_body"
          className="field min-h-28"
          value={copy}
          onChange={(e) => setCopy(e.target.value)}
          placeholder="Write the post copy, or tap ✨ Draft with AI to get a starting point."
        />
        <p className="mt-1 text-xs text-[var(--ink-faint)]">
          AI drafts are a starting point — always review before submitting for approval.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="campaign_id">
            Campaign
          </label>
          <select
            id="campaign_id"
            name="campaign_id"
            className="field"
            defaultValue={item?.campaign_id ?? ""}
          >
            <option value="">
              {campaigns.length ? "— None —" : "No campaigns yet"}
            </option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="weekly_theme_id">
            Weekly theme
          </label>
          <select
            id="weekly_theme_id"
            name="weekly_theme_id"
            className="field"
            defaultValue={item?.weekly_theme_id ?? ""}
          >
            <option value="">
              {themes.length ? "— None —" : "No themes yet"}
            </option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.theme_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="field-label" htmlFor="scheduled_date">
            Scheduled date
          </label>
          <input
            id="scheduled_date"
            name="scheduled_date"
            type="date"
            className="field"
            defaultValue={item?.scheduled_date ?? ""}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="scheduled_time">
            Time
          </label>
          <input
            id="scheduled_time"
            name="scheduled_time"
            type="time"
            className="field"
            defaultValue={item?.scheduled_time ?? ""}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="assigned_to">
            Assigned to
          </label>
          <input
            id="assigned_to"
            name="assigned_to"
            className="field"
            defaultValue={item?.assigned_to ?? ""}
            placeholder="e.g. Sarah Lim"
          />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="visual_notes">
          Visual notes
        </label>
        <textarea
          id="visual_notes"
          name="visual_notes"
          className="field"
          defaultValue={item?.visual_notes ?? ""}
          placeholder="Art direction, asset references…"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="published_url">
          Published URL
        </label>
        <input
          id="published_url"
          name="published_url"
          className="field"
          defaultValue={item?.published_url ?? ""}
          placeholder="https://… (once published)"
        />
      </div>

      <div className="flex gap-3">
        <SubmitButton>{item ? "Save changes" : "Create content item"}</SubmitButton>
      </div>
    </form>
  );
}
