import Link from "next/link";
import { getContentItems, getCampaigns } from "@/lib/data";
import {
  PageHeader,
  StatusBadge,
  PlatformBadge,
  EmptyState,
  ErrorState,
  ConfigNotice,
} from "@/components/ui";
import {
  weekDates,
  mondayOf,
  parseISODate,
  toISODate,
  addDays,
  formatDayMonth,
  WEEKDAY_LABELS,
} from "@/lib/format";
import { PLATFORMS } from "@/lib/types";
import type { ContentItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const items = await getContentItems();

  // Choose the anchor week: the `week` param, else the week of the earliest
  // scheduled item (so seeded data is visible on first load), else today.
  let anchor: Date;
  if (week) {
    anchor = parseISODate(week);
  } else {
    const scheduled = items.data
      .map((i) => i.scheduled_date)
      .filter((d): d is string => Boolean(d))
      .sort();
    anchor = scheduled.length ? parseISODate(scheduled[0]) : new Date();
  }

  const mon = mondayOf(anchor);
  const days = weekDates(mon);
  const prevWeek = toISODate(addDays(mon, -7));
  const nextWeek = toISODate(addDays(mon, 7));
  const thisWeek = toISODate(mondayOf(new Date()));

  const byDatePlatform = new Map<string, ContentItem[]>();
  for (const item of items.data) {
    if (!item.scheduled_date) continue;
    const key = `${item.scheduled_date}|${item.platform}`;
    const arr = byDatePlatform.get(key) ?? [];
    arr.push(item);
    byDatePlatform.set(key, arr);
  }
  const weekHasContent = days.some((d) =>
    items.data.some((i) => i.scheduled_date === d),
  );

  return (
    <div>
      <PageHeader
        title="Content Calendar"
        subtitle={`Week of ${formatDayMonth(days[0])} – ${formatDayMonth(days[6])}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/calendar?week=${prevWeek}`} className="btn-secondary">
              ← Prev
            </Link>
            <Link href={`/calendar?week=${thisWeek}`} className="btn-secondary">
              This week
            </Link>
            <Link href={`/calendar?week=${nextWeek}`} className="btn-secondary">
              Next →
            </Link>
            <Link href="/content/new" className="btn-primary">
              + New
            </Link>
          </div>
        }
      />

      {!items.configured ? (
        <ConfigNotice />
      ) : items.error ? (
        <ErrorState message={items.error} />
      ) : !weekHasContent ? (
        <EmptyState
          title="No content scheduled this week"
          hint="Use Prev/Next to browse other weeks, or add a new content item scheduled for this week."
          action={
            <Link href="/content/new" className="btn-primary">
              + New Content Item
            </Link>
          }
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="thead-warm border-b border-[var(--border-warm)]">
                <th className="w-32 px-3 py-3 text-left text-xs font-medium uppercase">
                  Platform
                </th>
                {days.map((d, i) => (
                  <th
                    key={d}
                    className="px-2 py-3 text-left text-xs font-medium"
                  >
                    <div className="uppercase">{WEEKDAY_LABELS[i]}</div>
                    <div className="opacity-70">{formatDayMonth(d)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLATFORMS.map((platform) => (
                <tr
                  key={platform}
                  className="border-b border-[var(--border-warm)] align-top"
                >
                  <td className="px-3 py-3">
                    <PlatformBadge value={platform} />
                  </td>
                  {days.map((d) => {
                    const cell = byDatePlatform.get(`${d}|${platform}`) ?? [];
                    return (
                      <td key={d} className="px-2 py-2">
                        <div className="space-y-1.5">
                          {cell.map((item) => (
                            <Link
                              key={item.id}
                              href={`/content/${item.id}`}
                              className="block rounded-md border border-stone-200 bg-white p-2 shadow-sm transition hover:border-[var(--brand-red)] hover:shadow"
                            >
                              <div className="line-clamp-2 text-xs font-medium text-stone-800">
                                {item.title}
                              </div>
                              <div className="mt-1">
                                <StatusBadge value={item.status} />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
