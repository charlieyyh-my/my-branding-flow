"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ContentItem } from "@/lib/types";
import { saveCaptionDraft, reviewCaptionDraft } from "@/lib/actions";
import { StatusBadge } from "@/components/ui";
import { toast } from "@/components/Toast";

const TWEAK_PRESETS = [
  "Make it shorter",
  "More festive 🧧",
  "More formal",
  "Punchier hook",
  "Add a question",
  "Fewer hashtags",
];

export function CaptionDraft({ item }: { item: ContentItem }) {
  const [pending, setPending] = useState(false);
  const [reviewing, startReview] = useTransition();
  const [tweak, setTweak] = useState("");
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
          // When redrafting, tweak from the current draft; else from the copy.
          brief: (hasDraft ? item.caption_draft : item.copy_body) ?? "",
          instructions: tweak.trim(),
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
      <p className="text-sm text-[var(--ink-soft)]">
        Generate a caption with AI, then accept it into the copy or reject it.
      </p>

      {/* Regenerate-with-tweaks box */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {TWEAK_PRESETS.map((p) => {
            const active = tweak === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setTweak(active ? "" : p)}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                  active
                    ? "border-[var(--brand-gold)] bg-[var(--brand-gold)]/15 text-[var(--ink)]"
                    : "border-[var(--border)] text-[var(--ink-soft)] hover:brightness-125"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="field min-w-0 flex-1"
            value={tweak}
            onChange={(e) => setTweak(e.target.value)}
            placeholder="Optional tweak — e.g. mention Chinese New Year, keep it under 2 lines"
          />
          <button
            type="button"
            onClick={draft}
            disabled={pending}
            className="btn-secondary shrink-0 !px-3 !py-1.5 text-xs"
          >
            {pending
              ? "Drafting…"
              : hasDraft
                ? tweak.trim()
                  ? "✨ Redraft with tweak"
                  : "✨ Redraft"
                : "✨ Draft caption with AI"}
          </button>
        </div>
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
