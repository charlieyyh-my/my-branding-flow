"use client";

import { useActionState, useRef, useState } from "react";
import type { ActionState } from "@/lib/actions";
import type { Campaign, WeeklyTheme } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";
import { FieldError } from "@/components/ui";
import { toast } from "@/components/Toast";

export function ThemeForm({
  action,
  campaigns,
  theme,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  campaigns: Campaign[];
  theme?: WeeklyTheme;
}) {
  const [state, formAction] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState(theme?.guiding_message ?? "");
  const [aiPending, setAiPending] = useState(false);

  async function draftWithAI() {
    const fd = new FormData(formRef.current ?? undefined);
    const themeName = String(fd.get("theme_name") ?? "").trim();
    if (!themeName) {
      toast("Add a theme name first");
      return;
    }
    const campaignId = String(fd.get("campaign_id") ?? "");
    const campaign = campaigns.find((c) => c.id === campaignId)?.name ?? "";
    setAiPending(true);
    try {
      const res = await fetch("/api/ai/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeName, campaign }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "AI draft failed");
        return;
      }
      setMessage(data.message);
      toast(
        data.source === "template"
          ? "Draft ready (free template)"
          : "Guiding message drafted ✨",
      );
    } catch {
      toast("Couldn’t reach the AI service");
    } finally {
      setAiPending(false);
    }
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {theme ? <input type="hidden" name="id" value={theme.id} /> : null}
      <FieldError message={state.error} />
      <div>
        <label className="field-label" htmlFor="theme_name">
          Theme name *
        </label>
        <input
          id="theme_name"
          name="theme_name"
          className="field"
          defaultValue={theme?.theme_name ?? ""}
          placeholder="e.g. Authenticity You Can Trust"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="week_start">
            Week starting (Monday) *
          </label>
          <input
            id="week_start"
            name="week_start"
            type="date"
            className="field"
            defaultValue={theme?.week_start ?? ""}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="campaign_id">
            Campaign
          </label>
          <select
            id="campaign_id"
            name="campaign_id"
            className="field"
            defaultValue={theme?.campaign_id ?? ""}
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
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label className="field-label mb-0" htmlFor="guiding_message">
            Guiding message
          </label>
          <button
            type="button"
            onClick={draftWithAI}
            disabled={aiPending}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-gold)] px-3 py-1 text-xs font-semibold text-[var(--brand-gold)] transition hover:bg-[var(--brand-gold)]/10 disabled:opacity-60"
          >
            {aiPending ? "Drafting…" : "✨ Draft with AI"}
          </button>
        </div>
        <textarea
          id="guiding_message"
          name="guiding_message"
          className="field"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="The core message all content this week should reinforce — or tap ✨ Draft with AI."
        />
      </div>
      <SubmitButton>{theme ? "Save changes" : "Create theme"}</SubmitButton>
    </form>
  );
}
