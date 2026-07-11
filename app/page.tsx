import Link from "next/link";
import {
  getContentItems,
  getCampaigns,
  getLeads,
  getWeeklyThemes,
} from "@/lib/data";
import {
  PageHeader,
  StatCard,
  Card,
  StatusBadge,
  ConfigNotice,
  ErrorState,
} from "@/components/ui";
import { formatDate } from "@/lib/format";
import { CONTENT_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [content, campaigns, leads, themes] = await Promise.all([
    getContentItems(),
    getCampaigns(),
    getLeads(),
    getWeeklyThemes(),
  ]);

  if (!content.configured) {
    return (
      <div>
        <PageHeader
          title="Operational Dashboard"
          subtitle="Century Mark Pacific — content operations at a glance."
        />
        <ConfigNotice />
      </div>
    );
  }
  if (content.error) {
    return (
      <div>
        <PageHeader title="Operational Dashboard" />
        <ErrorState message={content.error} />
      </div>
    );
  }

  const items = content.data;
  const countBy = (status: string) =>
    items.filter((i) => i.status === status).length;

  const pending = items.filter((i) => i.status === "in_review");
  const published = items
    .filter((i) => i.status === "published")
    .slice(0, 5);
  const activeCampaigns = campaigns.data.filter((c) => c.status === "active");
  const recentLeads = leads.data.slice(0, 5);
  const campaignName = new Map(campaigns.data.map((c) => [c.id, c.name]));

  return (
    <div>
      <PageHeader
        title="Operational Dashboard"
        subtitle="Century Mark Pacific — content operations at a glance."
        action={
          <Link href="/content/new" className="btn-primary">
            + New Content Item
          </Link>
        }
      />

      {/* Pipeline by status */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CONTENT_STATUSES.map((s) => (
          <StatCard
            key={s}
            label={
              s === "draft"
                ? "Drafts"
                : s === "in_review"
                  ? "In Review"
                  : s === "approved"
                    ? "Approved"
                    : "Published"
            }
            value={countBy(s)}
            href="/content"
            accent={s === "published" ? "#1e40af" : "#8b0000"}
          />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total content" value={items.length} href="/content" />
        <StatCard
          label="Active campaigns"
          value={activeCampaigns.length}
          href="/campaigns"
        />
        <StatCard
          label="Weekly themes"
          value={themes.data.length}
          href="/themes"
        />
        <StatCard label="Leads logged" value={leads.data.length} href="/leads" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Pending approvals
            </h2>
            <Link href="/content" className="text-xs text-[var(--brand-red)]">
              View all
            </Link>
          </div>
          {pending.length === 0 ? (
            <p className="text-sm text-stone-400">Nothing awaiting review. 🎉</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {pending.map((i) => (
                <li key={i.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <Link
                      href={`/content/${i.id}`}
                      className="block truncate text-sm font-medium text-stone-800 hover:text-[var(--brand-red)]"
                    >
                      {i.title}
                    </Link>
                    <div className="text-xs text-stone-400">
                      {i.platform} · {formatDate(i.scheduled_date)}
                    </div>
                  </div>
                  <StatusBadge value={i.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Recently published
            </h2>
            <Link href="/calendar" className="text-xs text-[var(--brand-red)]">
              Calendar
            </Link>
          </div>
          {published.length === 0 ? (
            <p className="text-sm text-stone-400">Nothing published yet.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {published.map((i) => (
                <li key={i.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <Link
                      href={`/content/${i.id}`}
                      className="block truncate text-sm font-medium text-stone-800 hover:text-[var(--brand-red)]"
                    >
                      {i.title}
                    </Link>
                    <div className="text-xs text-stone-400">
                      {i.platform} ·{" "}
                      {i.campaign_id ? campaignName.get(i.campaign_id) : "—"}
                    </div>
                  </div>
                  <StatusBadge value={i.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Active campaigns
            </h2>
            <Link href="/campaigns" className="text-xs text-[var(--brand-red)]">
              Manage
            </Link>
          </div>
          {activeCampaigns.length === 0 ? (
            <p className="text-sm text-stone-400">No active campaigns.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {activeCampaigns.map((c) => {
                const linked = items.filter(
                  (i) => i.campaign_id === c.id,
                ).length;
                return (
                  <li
                    key={c.id}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/campaigns/${c.id}`}
                        className="block truncate text-sm font-medium text-stone-800 hover:text-[var(--brand-red)]"
                      >
                        {c.name}
                      </Link>
                      <div className="text-xs text-stone-400">
                        {linked} linked item{linked === 1 ? "" : "s"}
                      </div>
                    </div>
                    <StatusBadge value={c.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Recent leads
            </h2>
            <Link href="/leads" className="text-xs text-[var(--brand-red)]">
              View all
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-stone-400">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {recentLeads.map((l) => (
                <li key={l.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <Link
                      href={`/leads/${l.id}`}
                      className="block truncate text-sm font-medium text-stone-800 hover:text-[var(--brand-red)]"
                    >
                      {l.contact_name}
                    </Link>
                    <div className="text-xs text-stone-400">
                      {l.company || "—"} · {l.source || "—"}
                    </div>
                  </div>
                  <StatusBadge value={l.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
