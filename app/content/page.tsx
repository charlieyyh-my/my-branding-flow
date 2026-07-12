import Link from "next/link";
import { getContentItems, getCampaigns } from "@/lib/data";
import { PageHeader, StatusBadge, PlatformBadge, CampaignTag, EmptyState, ErrorState, ConfigNotice } from "@/components/ui";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ContentListPage() {
  const [items, campaigns] = await Promise.all([
    getContentItems(),
    getCampaigns(),
  ]);
  const campaignName = new Map(campaigns.data.map((c) => [c.id, c.name]));

  return (
    <div>
      <PageHeader
        title="Content Items"
        subtitle="Every planned post across all platforms."
        action={
          <Link href="/content/new" className="btn-primary">
            + New Content Item
          </Link>
        }
      />

      {!items.configured ? (
        <ConfigNotice />
      ) : items.error ? (
        <ErrorState message={items.error} />
      ) : items.data.length === 0 ? (
        <EmptyState
          icon="✍️"
          title="No content yet"
          hint="Create your first content item to start planning the week."
          action={
            <Link href="/content/new" className="btn-primary">
              + New Content Item
            </Link>
          }
        />
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="space-y-3 md:hidden">
            {items.data.map((item) => (
              <Link
                key={item.id}
                href={`/content/${item.id}`}
                className="card block p-4 transition active:bg-[var(--surface-2)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 font-medium text-stone-900">
                    {item.title}
                  </div>
                  <StatusBadge value={item.status} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  <PlatformBadge value={item.platform} />
                  <span>{formatDate(item.scheduled_date)}</span>
                  {item.campaign_id ? (
                    <span className="truncate">
                      · {campaignName.get(item.campaign_id) ?? "—"}
                    </span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop / tablet: table */}
          <div className="card hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="thead-warm border-b border-[var(--border-warm)] text-left text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Platform</th>
                <th className="px-4 py-3 font-medium">Campaign</th>
                <th className="px-4 py-3 font-medium">Scheduled</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-warm)]">
              {items.data.map((item) => (
                <tr key={item.id} className="row-hover">
                  <td className="px-4 py-3">
                    <Link
                      href={`/content/${item.id}`}
                      className="font-medium text-stone-900 hover:text-[var(--brand-red)]"
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <PlatformBadge value={item.platform} />
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {item.campaign_id ? (
                      <CampaignTag
                        id={item.campaign_id}
                        name={campaignName.get(item.campaign_id) ?? "—"}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {formatDate(item.scheduled_date)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.status} />
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
