import Link from "next/link";
import { notFound } from "next/navigation";
import { getWeeklyTheme, getCampaigns } from "@/lib/data";
import { updateTheme, deleteTheme } from "@/lib/actions";
import { ThemeForm } from "@/components/ThemeForm";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader, Card, ConfigNotice, ErrorState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ThemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [themeRes, campaigns] = await Promise.all([
    getWeeklyTheme(id),
    getCampaigns(),
  ]);

  if (!themeRes.configured) {
    return (
      <div>
        <PageHeader title="Weekly Theme" />
        <ConfigNotice />
      </div>
    );
  }
  if (themeRes.error) {
    return (
      <div>
        <PageHeader title="Weekly Theme" />
        <ErrorState message={themeRes.error} />
      </div>
    );
  }
  const theme = themeRes.data;
  if (!theme) notFound();

  return (
    <div>
      <PageHeader
        title={theme.theme_name}
        action={
          <Link href="/themes" className="btn-secondary">
            ← All themes
          </Link>
        }
      />
      <div className="max-w-2xl space-y-6">
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">
            Edit theme
          </h2>
          <ThemeForm action={updateTheme} campaigns={campaigns.data} theme={theme} />
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
            Danger zone
          </h2>
          <form action={deleteTheme}>
            <input type="hidden" name="id" value={theme.id} />
            <DeleteButton
              label="Delete theme"
              confirm={`Delete theme "${theme.theme_name}"?`}
            />
          </form>
        </Card>
      </div>
    </div>
  );
}
