"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions";
import type { Campaign, MarketingAsset } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";
import { FieldError } from "@/components/ui";

const TYPES = ["image", "video", "document"];

export function AssetForm({
  action,
  campaigns,
  asset,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  campaigns: Campaign[];
  asset?: MarketingAsset;
}) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-5">
      {asset ? <input type="hidden" name="id" value={asset.id} /> : null}
      <FieldError message={state.error} />
      <div>
        <label className="field-label" htmlFor="name">
          Asset name *
        </label>
        <input
          id="name"
          name="name"
          className="field"
          defaultValue={asset?.name ?? ""}
          placeholder="e.g. Moutai CNY Red Banner 1080x1080"
          required
        />
      </div>
      <div>
        <label className="field-label" htmlFor="file_url">
          File URL *
        </label>
        <input
          id="file_url"
          name="file_url"
          className="field"
          defaultValue={asset?.file_url ?? ""}
          placeholder="https://…"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="asset_type">
            Type
          </label>
          <select
            id="asset_type"
            name="asset_type"
            className="field"
            defaultValue={asset?.asset_type ?? "image"}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="campaign_id">
            Campaign
          </label>
          <select
            id="campaign_id"
            name="campaign_id"
            className="field"
            defaultValue={asset?.campaign_id ?? ""}
          >
            <option value="">— None —</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="tags">
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          className="field"
          defaultValue={asset?.tags ?? ""}
          placeholder="comma, separated, tags"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="usage_notes">
          Usage notes
        </label>
        <textarea
          id="usage_notes"
          name="usage_notes"
          className="field"
          defaultValue={asset?.usage_notes ?? ""}
          placeholder="Where and how this asset may be used."
        />
      </div>
      <SubmitButton>{asset ? "Save changes" : "Add asset"}</SubmitButton>
    </form>
  );
}
