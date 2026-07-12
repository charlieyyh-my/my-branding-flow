"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setContentStatus } from "@/lib/actions";
import { CONTENT_STATUSES } from "@/lib/types";
import { label } from "@/lib/format";
import { toast } from "@/components/Toast";

export function StatusControl({
  id,
  status,
  publishedUrl,
}: {
  id: string;
  status: string;
  publishedUrl: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [url, setUrl] = useState(publishedUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function advance(next: string) {
    setError(null);
    if (next === "published" && !url.trim()) {
      setError("Add a published URL before marking this as Published.");
      return;
    }
    const fd = new FormData();
    fd.set("id", id);
    fd.set("status", next);
    if (next === "published") fd.set("published_url", url.trim());
    startTransition(async () => {
      try {
        await setContentStatus(fd);
        toast(`Moved to ${label(next)}`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to update status.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {CONTENT_STATUSES.map((s, i) => {
          const active = s === status;
          const isNext =
            CONTENT_STATUSES.indexOf(status as (typeof CONTENT_STATUSES)[number]) +
              1 ===
            i;
          return (
            <div key={s} className="flex items-center gap-2">
              <button
                type="button"
                disabled={pending || active}
                onClick={() => advance(s)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
                    : isNext
                      ? "border-[var(--brand-red)] bg-[var(--surface)] text-[var(--brand-red)] hover:brightness-125"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink-soft)] hover:bg-[var(--surface-2)]"
                }`}
              >
                {label(s)}
              </button>
              {i < CONTENT_STATUSES.length - 1 ? (
                <span className="text-[var(--ink-faint)]">→</span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div>
        <label className="field-label" htmlFor="pub-url">
          Published URL (required to publish)
        </label>
        <input
          id="pub-url"
          className="field max-w-lg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://instagram.com/p/…"
        />
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {pending ? (
        <p className="text-sm text-[var(--ink-soft)]">Updating…</p>
      ) : null}
    </div>
  );
}
