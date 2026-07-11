"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions";
import type { SeoKeyword } from "@/lib/types";
import { PRIORITIES } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";
import { FieldError } from "@/components/ui";

export function KeywordForm({
  action,
  keyword,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  keyword?: SeoKeyword;
}) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-5">
      {keyword ? <input type="hidden" name="id" value={keyword.id} /> : null}
      <FieldError message={state.error} />
      <div>
        <label className="field-label" htmlFor="keyword">
          Keyword *
        </label>
        <input
          id="keyword"
          name="keyword"
          className="field"
          defaultValue={keyword?.keyword ?? ""}
          placeholder="e.g. authorised Moutai importer Malaysia"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            name="category"
            className="field"
            defaultValue={keyword?.category ?? ""}
            placeholder="e.g. brand authority"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="field"
            defaultValue={keyword?.priority ?? "medium"}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="target_url">
          Target URL
        </label>
        <input
          id="target_url"
          name="target_url"
          className="field"
          defaultValue={keyword?.target_url ?? ""}
          placeholder="https://…"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          className="field"
          defaultValue={keyword?.notes ?? ""}
        />
      </div>
      <SubmitButton>{keyword ? "Save changes" : "Add keyword"}</SubmitButton>
    </form>
  );
}
