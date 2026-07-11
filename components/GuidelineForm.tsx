"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions";
import type { BrandGuideline } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";
import { FieldError } from "@/components/ui";

export function GuidelineForm({
  action,
  guideline,
  nextOrder,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  guideline?: BrandGuideline;
  nextOrder?: number;
}) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-5">
      {guideline ? <input type="hidden" name="id" value={guideline.id} /> : null}
      <FieldError message={state.error} />
      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <div>
          <label className="field-label" htmlFor="section_title">
            Section title *
          </label>
          <input
            id="section_title"
            name="section_title"
            className="field"
            defaultValue={guideline?.section_title ?? ""}
            placeholder="e.g. Brand Voice"
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="display_order">
            Display order
          </label>
          <input
            id="display_order"
            name="display_order"
            type="number"
            className="field"
            defaultValue={guideline?.display_order ?? nextOrder ?? 0}
          />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          className="field min-h-32"
          defaultValue={guideline?.content ?? ""}
          placeholder="The guideline text (markdown allowed)."
        />
      </div>
      <SubmitButton>{guideline ? "Save changes" : "Add section"}</SubmitButton>
    </form>
  );
}
