"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPerformance } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { FieldError } from "@/components/ui";

export function PerformanceForm({
  contentItemId,
  platform,
}: {
  contentItemId: string;
  platform: string;
}) {
  const [state, action] = useActionState(createPerformance, {});
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <input type="hidden" name="content_item_id" value={contentItemId} />
      <input type="hidden" name="platform" value={platform} />
      <FieldError message={state.error} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <NumberField name="reach" label="Reach" />
        <NumberField name="impressions" label="Impressions" />
        <NumberField name="clicks" label="Clicks" />
        <NumberField name="enquiries_generated" label="Enquiries" />
        <div>
          <label className="field-label" htmlFor="recorded_date">
            Date
          </label>
          <input
            id="recorded_date"
            name="recorded_date"
            type="date"
            className="field"
          />
        </div>
      </div>
      <SubmitButton className="btn-secondary">Log performance</SubmitButton>
    </form>
  );
}

function NumberField({ name, label }: { name: string; label: string }) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        min="0"
        defaultValue="0"
        className="field"
      />
    </div>
  );
}
