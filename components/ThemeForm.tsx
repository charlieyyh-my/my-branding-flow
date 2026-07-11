"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions";
import type { Campaign, WeeklyTheme } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";
import { FieldError } from "@/components/ui";

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
  return (
    <form action={formAction} className="space-y-5">
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
        <label className="field-label" htmlFor="guiding_message">
          Guiding message
        </label>
        <textarea
          id="guiding_message"
          name="guiding_message"
          className="field"
          defaultValue={theme?.guiding_message ?? ""}
          placeholder="The core message all content this week should reinforce."
        />
      </div>
      <SubmitButton>{theme ? "Save changes" : "Create theme"}</SubmitButton>
    </form>
  );
}
