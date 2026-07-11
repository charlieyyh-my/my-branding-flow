import Link from "next/link";
import { isConfigured } from "@/lib/supabase/server";
import { createCampaign } from "@/lib/actions";
import { CampaignForm } from "@/components/CampaignForm";
import { PageHeader, Card, ConfigNotice } from "@/components/ui";

export const dynamic = "force-dynamic";

export default function NewCampaignPage() {
  return (
    <div>
      <PageHeader
        title="New Campaign"
        action={
          <Link href="/campaigns" className="btn-secondary">
            ← Back
          </Link>
        }
      />
      {!isConfigured() ? (
        <ConfigNotice />
      ) : (
        <Card className="max-w-2xl">
          <CampaignForm action={createCampaign} />
        </Card>
      )}
    </div>
  );
}
