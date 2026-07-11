import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getContentItem,
  getCampaigns,
  getWeeklyThemes,
  getSocialPerformance,
} from "@/lib/data";
import {
  updateContentItem,
  deleteContentItem,
} from "@/lib/actions";
import { ContentForm } from "@/components/ContentForm";
import { StatusControl } from "@/components/StatusControl";
import { PerformanceForm } from "@/components/PerformanceForm";
import { DeleteButton } from "@/components/DeleteButton";
import {
  PageHeader,
  Card,
  StatusBadge,
  ConfigNotice,
  ErrorState,
} from "@/components/ui";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [itemRes, campaigns, themes, perf] = await Promise.all([
    getContentItem(id),
    getCampaigns(),
    getWeeklyThemes(),
    getSocialPerformance(),
  ]);

  if (!itemRes.configured) {
    return (
      <div>
        <PageHeader title="Content Item" />
        <ConfigNotice />
      </div>
    );
  }
  if (itemRes.error) {
    return (
      <div>
        <PageHeader title="Content Item" />
        <ErrorState message={itemRes.error} />
      </div>
    );
  }
  const item = itemRes.data;
  if (!item) notFound();

  const campaign = campaigns.data.find((c) => c.id === item.campaign_id);
  const theme = themes.data.find((t) => t.id === item.weekly_theme_id);
  const itemPerf = perf.data.filter((p) => p.content_item_id === item.id);

  return (
    <div>
      <PageHeader
        title={item.title}
        subtitle={`${item.platform} · scheduled ${formatDate(item.scheduled_date)}`}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge value={item.status} />
            <Link href="/content" className="btn-secondary">
              ← All content
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">
              Approval workflow
            </h2>
            <StatusControl
              id={item.id}
              status={item.status}
              publishedUrl={item.published_url}
            />
          </Card>

          <Card>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">
              Edit details
            </h2>
            <ContentForm
              action={updateContentItem}
              campaigns={campaigns.data}
              themes={themes.data}
              item={item}
            />
          </Card>

          <Card>
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-stone-500">
              Social performance
            </h2>
            <p className="mb-4 text-sm text-stone-500">
              Log reach and engagement once this item is published.
            </p>
            {itemPerf.length > 0 ? (
              <table className="mb-4 w-full text-sm">
                <thead className="text-left text-xs uppercase text-stone-400">
                  <tr>
                    <th className="py-1">Date</th>
                    <th className="py-1">Reach</th>
                    <th className="py-1">Impr.</th>
                    <th className="py-1">Clicks</th>
                    <th className="py-1">Enquiries</th>
                  </tr>
                </thead>
                <tbody>
                  {itemPerf.map((p) => (
                    <tr key={p.id} className="border-t border-stone-100">
                      <td className="py-1">{formatDate(p.recorded_date)}</td>
                      <td className="py-1">{p.reach ?? 0}</td>
                      <td className="py-1">{p.impressions ?? 0}</td>
                      <td className="py-1">{p.clicks ?? 0}</td>
                      <td className="py-1">{p.enquiries_generated ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mb-4 text-sm text-stone-400">
                No performance logged yet.
              </p>
            )}
            <PerformanceForm contentItemId={item.id} platform={item.platform} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
              Details
            </h2>
            <dl className="space-y-3 text-sm">
              <Detail label="Campaign" value={campaign?.name} />
              <Detail label="Weekly theme" value={theme?.theme_name} />
              <Detail label="Assigned to" value={item.assigned_to} />
              <Detail label="Scheduled" value={formatDate(item.scheduled_date)} />
              <Detail label="Time" value={item.scheduled_time} />
              <div>
                <dt className="text-stone-500">Published URL</dt>
                <dd className="mt-0.5 break-words font-medium text-stone-800">
                  {item.published_url ? (
                    <a
                      href={item.published_url}
                      className="text-[var(--brand-red)] underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.published_url}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </Card>

          {item.copy_body ? (
            <Card>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500">
                Copy
              </h2>
              <p className="whitespace-pre-wrap text-sm text-stone-700">
                {item.copy_body}
              </p>
            </Card>
          ) : null}

          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
              Danger zone
            </h2>
            <form action={deleteContentItem}>
              <input type="hidden" name="id" value={item.id} />
              <DeleteButton
                label="Delete content item"
                confirm={`Delete "${item.title}"? This cannot be undone.`}
              />
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-stone-500">{label}</dt>
      <dd className="mt-0.5 font-medium text-stone-800">{value || "—"}</dd>
    </div>
  );
}
