import Link from "next/link";
import { getCampaigns, getWeeklyThemes } from "@/lib/data";
import { createContentItem } from "@/lib/actions";
import { ContentForm } from "@/components/ContentForm";
import { PageHeader, Card, ConfigNotice } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function NewContentPage() {
  const [campaigns, themes] = await Promise.all([
    getCampaigns(),
    getWeeklyThemes(),
  ]);

  return (
    <div>
      <PageHeader
        title="New Content Item"
        subtitle="Capture a post and route it through the approval workflow."
        action={
          <Link href="/content" className="btn-secondary">
            ← Back to list
          </Link>
        }
      />
      {!campaigns.configured ? (
        <ConfigNotice />
      ) : (
        <Card className="max-w-3xl">
          <ContentForm
            action={createContentItem}
            campaigns={campaigns.data}
            themes={themes.data}
          />
        </Card>
      )}
    </div>
  );
}
