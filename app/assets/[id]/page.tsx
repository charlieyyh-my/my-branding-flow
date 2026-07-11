import Link from "next/link";
import { notFound } from "next/navigation";
import { getMarketingAssets, getCampaigns } from "@/lib/data";
import { updateAsset, deleteAsset } from "@/lib/actions";
import { AssetForm } from "@/components/AssetForm";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader, Card, ConfigNotice, ErrorState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [assets, campaigns] = await Promise.all([
    getMarketingAssets(),
    getCampaigns(),
  ]);

  if (!assets.configured) {
    return (
      <div>
        <PageHeader title="Asset" />
        <ConfigNotice />
      </div>
    );
  }
  if (assets.error) {
    return (
      <div>
        <PageHeader title="Asset" />
        <ErrorState message={assets.error} />
      </div>
    );
  }
  const asset = assets.data.find((a) => a.id === id);
  if (!asset) notFound();

  return (
    <div>
      <PageHeader
        title={asset.name}
        action={
          <Link href="/assets" className="btn-secondary">
            ← All assets
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">
              Edit asset
            </h2>
            <AssetForm
              action={updateAsset}
              campaigns={campaigns.data}
              asset={asset}
            />
          </Card>
        </div>
        <div className="space-y-6">
          {asset.file_url ? (
            <Card>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
                Preview
              </h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.file_url}
                alt={asset.name}
                className="w-full rounded-lg border border-stone-200"
              />
            </Card>
          ) : null}
          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
              Danger zone
            </h2>
            <form action={deleteAsset}>
              <input type="hidden" name="id" value={asset.id} />
              <DeleteButton
                label="Delete asset"
                confirm={`Delete asset "${asset.name}"?`}
              />
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
