import Link from "next/link";
import { getCampaigns } from "@/lib/data";
import { createTheme } from "@/lib/actions";
import { ThemeForm } from "@/components/ThemeForm";
import { PageHeader, Card, ConfigNotice } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function NewThemePage() {
  const campaigns = await getCampaigns();
  return (
    <div>
      <PageHeader
        title="New Weekly Theme"
        action={
          <Link href="/themes" className="btn-secondary">
            ← Back
          </Link>
        }
      />
      {!campaigns.configured ? (
        <ConfigNotice />
      ) : (
        <Card className="max-w-2xl">
          <ThemeForm action={createTheme} campaigns={campaigns.data} />
        </Card>
      )}
    </div>
  );
}
