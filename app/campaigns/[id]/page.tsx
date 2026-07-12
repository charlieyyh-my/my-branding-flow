import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampaign, getContentItems } from "@/lib/data";
import { updateCampaign, deleteCampaign } from "@/lib/actions";
import { CampaignForm } from "@/components/CampaignForm";
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

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [campaignRes, content] = await Promise.all([
    getCampaign(id),
    getContentItems(),
  ]);

  if (!campaignRes.configured) {
    return (
      <div>
        <PageHeader title="Campaign" />
        <ConfigNotice />
      </div>
    );
  }
  if (campaignRes.error) {
    return (
      <div>
        <PageHeader title="Campaign" />
        <ErrorState message={campaignRes.error} />
      </div>
    );
  }
  const campaign = campaignRes.data;
  if (!campaign) notFound();

  const linked = content.data.filter((i) => i.campaign_id === campaign.id);

  return (
    <div>
      <PageHeader
        title={campaign.name}
        subtitle={`${linked.length} linked content item${linked.length === 1 ? "" : "s"}`}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge value={campaign.status} />
            <Link href="/campaigns" className="btn-secondary">
              ← All campaigns
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
              Edit campaign
            </h2>
            <CampaignForm action={updateCampaign} campaign={campaign} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
              Linked content ({linked.length})
            </h2>
            {linked.length === 0 ? (
              <p className="text-sm text-[var(--ink-faint)]">
                No content linked to this campaign yet.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {linked.map((i) => (
                  <li
                    key={i.id}
                    className="flex items-center justify-between py-2"
                  >
                    <Link
                      href={`/content/${i.id}`}
                      className="min-w-0 truncate text-sm font-medium text-[var(--ink)] hover:text-[var(--brand-red)]"
                    >
                      {i.title}
                    </Link>
                    <StatusBadge value={i.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
              Dates
            </h2>
            <p className="text-sm text-[var(--ink-soft)]">
              {formatDate(campaign.start_date)} – {formatDate(campaign.end_date)}
            </p>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
              Danger zone
            </h2>
            <p className="mb-3 text-xs text-[var(--ink-soft)]">
              Deleting unlinks its content items (they are not deleted).
            </p>
            <form action={deleteCampaign}>
              <input type="hidden" name="id" value={campaign.id} />
              <DeleteButton
                label="Delete campaign"
                confirm={`Delete campaign "${campaign.name}"? Linked content will be unlinked.`}
              />
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
