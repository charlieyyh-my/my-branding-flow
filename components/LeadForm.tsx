"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionState } from "@/lib/actions";
import type { LeadEnquiry } from "@/lib/types";
import { LEAD_STATUSES } from "@/lib/types";
import { label } from "@/lib/format";
import { SubmitButton } from "@/components/SubmitButton";
import { FieldError } from "@/components/ui";

export function LeadForm({
  action,
  lead,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  lead?: LeadEnquiry;
}) {
  const [state, formAction] = useActionState(action, {});
  const router = useRouter();
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <form action={formAction} className="space-y-5">
      {lead ? <input type="hidden" name="id" value={lead.id} /> : null}
      <FieldError message={state.error} />
      {state.ok ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Saved.
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="contact_name">
            Contact name *
          </label>
          <input
            id="contact_name"
            name="contact_name"
            className="field"
            defaultValue={lead?.contact_name ?? ""}
            placeholder="e.g. David Khor"
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="company">
            Company
          </label>
          <input
            id="company"
            name="company"
            className="field"
            defaultValue={lead?.company ?? ""}
            placeholder="e.g. Petronas Dagangan"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="enquiry_type">
            Enquiry type
          </label>
          <input
            id="enquiry_type"
            name="enquiry_type"
            className="field"
            defaultValue={lead?.enquiry_type ?? ""}
            placeholder="e.g. Corporate gifting"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="source">
            Source
          </label>
          <input
            id="source"
            name="source"
            className="field"
            defaultValue={lead?.source ?? ""}
            placeholder="e.g. Instagram DM"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="field"
            defaultValue={lead?.status ?? "new"}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="follow_up_date">
            Follow-up date
          </label>
          <input
            id="follow_up_date"
            name="follow_up_date"
            type="date"
            className="field"
            defaultValue={lead?.follow_up_date ?? ""}
          />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          className="field"
          defaultValue={lead?.notes ?? ""}
        />
      </div>
      <SubmitButton>{lead ? "Save changes" : "Log lead"}</SubmitButton>
    </form>
  );
}
