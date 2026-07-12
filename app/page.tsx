import Link from "next/link";
import { getContentItems, getCampaigns, getLeads } from "@/lib/data";
import {
  Card,
  StatusBadge,
  PlatformBadge,
  ConfigNotice,
  ErrorState,
} from "@/components/ui";
import { GettingStarted } from "@/components/GettingStarted";
import { CountUp } from "@/components/CountUp";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const QUICK_ACTIONS = [
  {
    href: "/content/new",
    icon: "✍️",
    title: "Write a post",
    sub: "Facebook · Instagram · Rednote",
  },
  {
    href: "/calendar",
    icon: "🗓️",
    title: "See the week",
    sub: "What’s going out and when",
  },
  {
    href: "/leads/new",
    icon: "📨",
    title: "Add an enquiry",
    sub: "Someone messaged you? Save them",
  },
];

const PIPELINE = [
  { status: "draft", label: "Drafts", icon: "✍️" },
  { status: "in_review", label: "In review", icon: "👀" },
  { status: "approved", label: "Approved", icon: "✅" },
  { status: "published", label: "Published", icon: "🚀" },
];

export default async function DashboardPage() {
  const [content, campaigns, leads] = await Promise.all([
    getContentItems(),
    getCampaigns(),
    getLeads(),
  ]);

  if (!content.configured) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-bold text-[var(--ink)]">Welcome 👋</h1>
        <ConfigNotice />
      </div>
    );
  }
  if (content.error) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-bold text-[var(--ink)]">Welcome 👋</h1>
        <ErrorState message={content.error} />
      </div>
    );
  }

  const items = content.data;
  const countBy = (status: string) =>
    items.filter((i) => i.status === status).length;

  const pending = items.filter((i) => i.status === "in_review");
  const followUps = leads.data
    .filter((l) => l.status === "new" || l.status === "in_progress")
    .slice(0, 5);
  const campaignName = new Map(campaigns.data.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-6">
      {/* Friendly greeting */}
      <div className="animate-in">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">
          Your content workspace
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          Plan a post, get it approved, publish it, and keep track of who’s
          interested — all in one place.
        </p>
      </div>

      {/* Step-by-step guide */}
      <div className="animate-in" style={{ animationDelay: "60ms" }}>
        <GettingStarted
          hasContent={items.length > 0}
          hasReviewed={items.some((i) => i.status !== "draft")}
          hasPublished={items.some((i) => i.status === "published")}
          hasLead={leads.data.length > 0}
        />
      </div>

      {/* Quick actions */}
      <div
        className="animate-in grid gap-4 sm:grid-cols-3"
        style={{ animationDelay: "120ms" }}
      >
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="card lift flex items-center gap-4 p-4"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
              style={{ background: "var(--surface-2)" }}
            >
              {a.icon}
            </span>
            <div className="min-w-0">
              <div className="font-semibold text-[var(--ink)]">{a.title}</div>
              <div className="text-xs text-[var(--ink-soft)]">{a.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* At a glance */}
      <div
        className="animate-in grid grid-cols-2 gap-3 sm:grid-cols-4"
        style={{ animationDelay: "180ms" }}
      >
        {PIPELINE.map((p) => (
          <Link
            key={p.status}
            href="/content"
            className="card lift flex items-center gap-3 p-4"
          >
            <span className="text-xl">{p.icon}</span>
            <div>
              <div className="text-2xl font-bold text-[var(--ink)]">
                <CountUp value={countBy(p.status)} />
              </div>
              <div className="text-xs text-[var(--ink-soft)]">{p.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Needs you */}
      <div
        className="animate-in grid gap-6 lg:grid-cols-2"
        style={{ animationDelay: "240ms" }}
      >
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-[var(--ink)]">
              👀 Waiting for approval
            </h2>
            <Link
              href="/content"
              className="text-xs font-medium text-[var(--brand-red)]"
            >
              View all
            </Link>
          </div>
          {pending.length === 0 ? (
            <p className="text-sm text-[var(--ink-faint)]">
              Nothing waiting right now. Nice and clear. 🎉
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {pending.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/content/${i.id}`}
                      className="block truncate text-sm font-medium text-[var(--ink)] hover:text-[var(--brand-red)]"
                    >
                      {i.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[var(--ink-faint)]">
                      <PlatformBadge value={i.platform} />
                      <span>{formatDate(i.scheduled_date)}</span>
                    </div>
                  </div>
                  <Link
                    href={`/content/${i.id}`}
                    className="btn-secondary shrink-0 !px-3 !py-1.5 text-xs"
                  >
                    Review →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-[var(--ink)]">
              📨 People to follow up
            </h2>
            <Link
              href="/leads"
              className="text-xs font-medium text-[var(--brand-red)]"
            >
              View all
            </Link>
          </div>
          {followUps.length === 0 ? (
            <p className="text-sm text-[var(--ink-faint)]">
              No open enquiries.{" "}
              <Link href="/leads/new" className="text-[var(--brand-red)]">
                Add one →
              </Link>
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {followUps.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/leads/${l.id}`}
                      className="block truncate text-sm font-medium text-[var(--ink)] hover:text-[var(--brand-red)]"
                    >
                      {l.contact_name}
                    </Link>
                    <div className="text-xs text-[var(--ink-faint)]">
                      {l.company || "—"}
                      {l.follow_up_date
                        ? ` · follow up ${formatDate(l.follow_up_date)}`
                        : ""}
                    </div>
                  </div>
                  <StatusBadge value={l.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {campaignName.size > 0 ? (
        <p className="text-center text-xs text-[var(--ink-faint)]">
          Tip: group related posts under a{" "}
          <Link href="/campaigns" className="text-[var(--brand-red)]">
            campaign
          </Link>{" "}
          to see them together.
        </p>
      ) : null}
    </div>
  );
}
