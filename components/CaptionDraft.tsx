"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ContentItem } from "@/lib/types";
import { saveCaptionDraft, reviewCaptionDraft } from "@/lib/actions";
import { StatusBadge } from "@/components/ui";
import { toast } from "@/components/Toast";

export function CaptionDraft({ item }: { item: ContentItem }) {
  const [pending, setPending] = useState(false);
  const [reviewing, startReview] = useTransition();
  const router = useRouter();

  const hasDraft = Boolean(item.caption_draft);
  const status = item.caption_review_status ?? "unreviewed";

  async function draft() {
    setPending(true);
    try {
      const res = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          platform: item.platform,
          brief: item.copy_body ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "AI draft failed");
        return;
      }
      const confidence = data.source === "template" ? 0.4 : 0.8;
      const saved = await saveCaptionDraft({
        id: item.id,
        caption: data.caption,
        source: data.source,
        confidence,
      });
      if (saved.error) {
        toast(saved.error);
        return;
      }
      toast(
        data.source === "template"
          ? "Draft ready (free template) — review below"
          : "Caption drafted ✨ — review below",
      );
      router.refresh();
    } catch {
      toast("Couldn’t reach the AI service");
    } finally {
      setPending(false);
    }
  }

  function review(decision: "accepted" | "rejected") {
    startReview(async () => {
      const r = await reviewCaptionDraft({ id: item.id, decision });
      if (r.error) {
        toast(r.error);
        return;
      }
      toast(
        decision === "accepted"
          ? "Accepted — draft is now the copy"
          : "Draft rejected",
      );
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-[var(--ink-soft)]">
          Generate a caption with AI, then accept it into the copy or reject it.
        </p>
        <button
          type="button"
          onClick={draft}
          disabled={pending}
          className="btn-secondary !px-3 !py-1.5 text-xs"
        >
          {pending ? "Drafting…" : hasDraft ? "✨ Redraft" : "✨ Draft caption with AI"}
        </button>
      </div>

      {hasDraft ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[var(--ink-faint)]">
            <StatusBadge value={status} />
            <span>
              via {item.caption_source ?? "AI"}
              {item.caption_confidence != null
                ? ` · confidence ${Math.round(Number(item.caption_confidence) * 100)}%`
                : ""}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-sm text-[var(--ink)]">
            {item.caption_draft}
          </p>
          {status === "unreviewed" ? (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => review("accepted")}
                disabled={reviewing}
                className="btn-primary !px-3 !py-1.5 text-xs"
              >
                ✓ Accept into copy
              </button>
              <button
                type="button"
                onClick={() => review("rejected")}
                disabled={reviewing}
                className="btn-danger !px-3 !py-1.5 text-xs"
              >
                ✕ Reject
              </button>
            </div>
          ) : (
            <p className="mt-2 text-xs text-[var(--ink-faint)]">
              {status === "accepted"
                ? "This draft was accepted into the copy."
                : "This draft was rejected. Redraft to try again."}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
