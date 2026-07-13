"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addSuggestedKeyword } from "@/lib/actions";
import { StatusBadge } from "@/components/ui";
import { toast } from "@/components/Toast";
import type { KeywordSuggestion } from "@/lib/keyword-template";

export function KeywordSuggester() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [adding, startAdd] = useTransition();
  const router = useRouter();

  async function fetchSuggestions() {
    setLoading(true);
    setOpen(true);
    try {
      const res = await fetch("/api/ai/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setSuggestions(data.keywords ?? []);
      toast(
        data.source === "template"
          ? "Suggestions ready (free list)"
          : "Suggestions ready ✨",
      );
    } catch {
      toast("Couldn’t fetch suggestions");
    } finally {
      setLoading(false);
    }
  }

  function add(s: KeywordSuggestion) {
    startAdd(async () => {
      const r = await addSuggestedKeyword(s);
      if (r?.error) {
        toast(r.error);
        return;
      }
      setSuggestions((list) => list.filter((x) => x.keyword !== s.keyword));
      toast(`Added “${s.keyword}”`);
      router.refresh();
    });
  }

  return (
    <div className="card mb-4 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="field max-w-xs"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Optional focus, e.g. corporate gifting"
        />
        <button
          type="button"
          onClick={fetchSuggestions}
          disabled={loading}
          className="btn-secondary"
        >
          {loading ? "Thinking…" : "✨ Suggest keywords with AI"}
        </button>
      </div>

      {open && !loading && suggestions.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--ink-faint)]">
          No new suggestions — you may already have them all.
        </p>
      ) : null}

      {suggestions.length > 0 ? (
        <ul className="mt-3 divide-y divide-[var(--border)]">
          {suggestions.map((s) => (
            <li
              key={s.keyword}
              className="flex items-center justify-between gap-3 py-2"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-[var(--ink)]">
                  {s.keyword}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--ink-faint)]">
                  <StatusBadge value={s.priority} />
                  <span>{s.category}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => add(s)}
                disabled={adding}
                className="btn-primary shrink-0 !px-3 !py-1.5 text-xs"
              >
                + Add
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
