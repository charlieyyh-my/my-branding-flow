"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Campaign, ContentItem } from "@/lib/types";
import { PLATFORMS, CONTENT_STATUSES } from "@/lib/types";
import { PlatformBadge, CampaignTag } from "@/components/ui";
import { formatDate, label } from "@/lib/format";
import { setContentStatus } from "@/lib/actions";
import { toast } from "@/components/Toast";

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
          : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--ink-soft)] hover:brightness-125"
      }`}
    >
      {children}
    </button>
  );
}

function InlineStatus({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const [val, setVal] = useState(status);
  const router = useRouter();

  function change(next: string) {
    if (next === val) return;
    const prev = val;
    setVal(next);
    const fd = new FormData();
    fd.set("id", id);
    fd.set("status", next);
    start(async () => {
      try {
        await setContentStatus(fd);
        toast(`Moved to ${label(next)}`);
        router.refresh();
      } catch {
        setVal(prev);
        toast("Couldn’t update status");
      }
    });
  }

  return (
    <select
      value={val}
      disabled={pending}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => change(e.target.value)}
      aria-label="Change status"
      className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)] outline-none disabled:opacity-60"
    >
      {CONTENT_STATUSES.map((s) => (
        <option key={s} value={s}>
          {label(s)}
        </option>
      ))}
    </select>
  );
}

export function ContentListClient({
  items,
  campaigns,
}: {
  items: ContentItem[];
  campaigns: Campaign[];
}) {
  const [platform, setPlatform] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const campaignName = useMemo(
    () => new Map(campaigns.map((c) => [c.id, c.name])),
    [campaigns],
  );

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          (platform === "All" || i.platform === platform) &&
          (status === "All" || i.status === status),
      ),
    [items, platform, status],
  );

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="card space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase text-[var(--ink-faint)]">
            Channel
          </span>
          <Pill active={platform === "All"} onClick={() => setPlatform("All")}>
            All
          </Pill>
          {PLATFORMS.map((p) => (
            <Pill key={p} active={platform === p} onClick={() => setPlatform(p)}>
              {p}
            </Pill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase text-[var(--ink-faint)]">
            Status
          </span>
          <Pill active={status === "All"} onClick={() => setStatus("All")}>
            All
          </Pill>
          {CONTENT_STATUSES.map((s) => (
            <Pill key={s} active={status === s} onClick={() => setStatus(s)}>
              {label(s)}
            </Pill>
          ))}
        </div>
      </div>

      <p className="text-xs text-[var(--ink-faint)]">
        Showing {filtered.length} of {items.length} posts
      </p>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-sm text-[var(--ink-soft)]">
          No posts match these filters.{" "}
          <button
            type="button"
            className="text-[var(--brand-red)]"
            onClick={() => {
              setPlatform("All");
              setStatus("All");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((item) => (
              <div key={item.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/content/${item.id}`}
                    className="min-w-0 font-medium text-[var(--ink)]"
                  >
                    {item.title}
                  </Link>
                  <InlineStatus id={item.id} status={item.status} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--ink-soft)]">
                  <PlatformBadge value={item.platform} />
                  <span>{formatDate(item.scheduled_date)}</span>
                  {item.campaign_id ? (
                    <CampaignTag
                      id={item.campaign_id}
                      name={campaignName.get(item.campaign_id) ?? "—"}
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop / tablet: table */}
          <div className="card hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="thead-warm border-b border-[var(--border)] text-left text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Channel</th>
                  <th className="px-4 py-3 font-medium">Campaign</th>
                  <th className="px-4 py-3 font-medium">Scheduled</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((item) => (
                  <tr key={item.id} className="row-hover">
                    <td className="px-4 py-3">
                      <Link
                        href={`/content/${item.id}`}
                        className="font-medium text-[var(--ink)] hover:text-[var(--brand-red)]"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <PlatformBadge value={item.platform} />
                    </td>
                    <td className="px-4 py-3">
                      {item.campaign_id ? (
                        <CampaignTag
                          id={item.campaign_id}
                          name={campaignName.get(item.campaign_id) ?? "—"}
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--ink-soft)]">
                      {formatDate(item.scheduled_date)}
                    </td>
                    <td className="px-4 py-3">
                      <InlineStatus id={item.id} status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
