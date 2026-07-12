import Link from "next/link";
import { getWeeklyThemes, getCampaigns, getContentItems } from "@/lib/data";
import {
  PageHeader,
  EmptyState,
  ErrorState,
  ConfigNotice,
} from "@/components/ui";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ThemesPage() {
  const [themes, campaigns, content] = await Promise.all([
    getWeeklyThemes(),
    getCampaigns(),
    getContentItems(),
  ]);
  const campaignName = new Map(campaigns.data.map((c) => [c.id, c.name]));

  return (
    <div>
      <PageHeader
        title="Weekly Themes"
        subtitle="A guiding message for each week's content."
        action={
          <Link href="/themes/new" className="btn-primary">
            + New Theme
          </Link>
        }
      />

      {!themes.configured ? (
        <ConfigNotice />
      ) : themes.error ? (
        <ErrorState message={themes.error} />
      ) : themes.data.length === 0 ? (
        <EmptyState
          title="No themes yet"
          hint="Add a weekly theme to steer the week's messaging."
          action={
            <Link href="/themes/new" className="btn-primary">
              + New Theme
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {themes.data.map((t) => {
            const linked = content.data.filter(
              (i) => i.weekly_theme_id === t.id,
            ).length;
            return (
              <Link
                key={t.id}
                href={`/themes/${t.id}`}
                className="card block p-5 transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-[var(--ink)]">{t.theme_name}</h3>
                  <span className="text-xs text-[var(--ink-faint)]">
                    Week of {formatDate(t.week_start)}
                  </span>
                </div>
                {t.guiding_message ? (
                  <p className="mt-2 text-sm text-[var(--ink-soft)]">
                    “{t.guiding_message}”
                  </p>
                ) : null}
                <div className="mt-3 flex items-center gap-3 text-xs text-[var(--ink-faint)]">
                  <span>
                    {t.campaign_id
                      ? campaignName.get(t.campaign_id) ?? "—"
                      : "No campaign"}
                  </span>
                  <span>·</span>
                  <span className="font-semibold text-[var(--brand-red)]">
                    {linked} content item{linked === 1 ? "" : "s"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
