import Link from "next/link";
import { getCampaigns } from "@/lib/data";
import { createAsset } from "@/lib/actions";
import { AssetForm } from "@/components/AssetForm";
import { PageHeader, Card, ConfigNotice } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function NewAssetPage() {
  const campaigns = await getCampaigns();
  return (
    <div>
      <PageHeader
        title="Add Asset"
        action={
          <Link href="/assets" className="btn-secondary">
            ← Back
          </Link>
        }
      />
      {!campaigns.configured ? (
        <ConfigNotice />
      ) : (
        <Card className="max-w-2xl">
          <AssetForm action={createAsset} campaigns={campaigns.data} />
        </Card>
      )}
    </div>
  );
}
