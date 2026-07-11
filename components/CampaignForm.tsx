"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions";
import type { Campaign } from "@/lib/types";
import { CAMPAIGN_STATUSES } from "@/lib/types";
import { label } from "@/lib/format";
import { SubmitButton } from "@/components/SubmitButton";
import { FieldError } from "@/components/ui";

export function CampaignForm({
  action,
  campaign,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  campaign?: Campaign;
}) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-5">
      {campaign ? <input type="hidden" name="id" value={campaign.id} /> : null}
      <FieldError message={state.error} />
      <div>
        <label className="field-label" htmlFor="name">
          Campaign name *
        </label>
        <input
          id="name"
          name="name"
          className="field"
          defaultValue={campaign?.name ?? ""}
          placeholder="e.g. Moutai CNY Heritage Series"
          required
        />
      </div>
      <div>
        <label className="field-label" htmlFor="objective">
          Objective
        </label>
        <textarea
          id="objective"
          name="objective"
          className="field"
          defaultValue={campaign?.objective ?? ""}
          placeholder="What is this campaign trying to achieve?"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="field-label" htmlFor="start_date">
            Start date
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            className="field"
            defaultValue={campaign?.start_date ?? ""}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="end_date">
            End date
          </label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            className="field"
            defaultValue={campaign?.end_date ?? ""}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="field"
            defaultValue={campaign?.status ?? "planned"}
          >
            {CAMPAIGN_STATUSES.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <SubmitButton>{campaign ? "Save changes" : "Create campaign"}</SubmitButton>
    </form>
  );
}
