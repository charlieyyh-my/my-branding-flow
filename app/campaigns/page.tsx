import Link from "next/link";
import { getCampaigns, getContentItems } from "@/lib/data";
import {
  PageHeader,
  StatusBadge,
  CampaignDot,
  EmptyState,
  ErrorState,
  ConfigNotice,
} from "@/components/ui";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const [campaigns, content] = await Promise.all([
    getCampaigns(),
    getContentItems(),
  ]);
  const linkedCount = (id: string) =>
    content.data.filter((i) => i.campaign_id === id).length;

  return (
    <div>
      <PageHeader
        title="Campaigns"
        subtitle="Group content under a marketing objective."
        action={
          <Link href="/campaigns/new" className="btn-primary">
            + New Campaign
          </Link>
        }
      />

      {!campaigns.configured ? (
        <ConfigNotice />
      ) : campaigns.error ? (
        <ErrorState message={campaigns.error} />
      ) : campaigns.data.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No campaigns yet"
          hint="Create a campaign to organise your content."
          action={
            <Link href="/campaigns/new" className="btn-primary">
              + New Campaign
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.data.map((c) => (
            <Link
              key={c.id}
              href={`/campaigns/${c.id}`}
              className="card p-5 transition hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="flex items-center gap-2 font-semibold text-stone-900">
                  <CampaignDot seed={c.id} />
                  {c.name}
                </h3>
                <StatusBadge value={c.status} />
              </div>
              {c.objective ? (
                <p className="mb-3 line-clamp-2 text-sm text-stone-500">
                  {c.objective}
                </p>
              ) : null}
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>
                  {formatDate(c.start_date)} – {formatDate(c.end_date)}
                </span>
                <span className="font-semibold text-[var(--brand-red)]">
                  {linkedCount(c.id)} linked
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
