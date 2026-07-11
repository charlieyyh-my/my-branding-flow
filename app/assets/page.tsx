import Link from "next/link";
import { getMarketingAssets, getCampaigns } from "@/lib/data";
import {
  PageHeader,
  EmptyState,
  ErrorState,
  ConfigNotice,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const [assets, campaigns] = await Promise.all([
    getMarketingAssets(),
    getCampaigns(),
  ]);
  const campaignName = new Map(campaigns.data.map((c) => [c.id, c.name]));

  return (
    <div>
      <PageHeader
        title="Asset Library"
        subtitle="Approved images, video, and documents by campaign."
        action={
          <Link href="/assets/new" className="btn-primary">
            + Add Asset
          </Link>
        }
      />

      {!assets.configured ? (
        <ConfigNotice />
      ) : assets.error ? (
        <ErrorState message={assets.error} />
      ) : assets.data.length === 0 ? (
        <EmptyState
          title="No assets yet"
          hint="Add your first asset by URL."
          action={
            <Link href="/assets/new" className="btn-primary">
              + Add Asset
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.data.map((a) => (
            <Link
              key={a.id}
              href={`/assets/${a.id}`}
              className="card overflow-hidden transition hover:shadow-md"
            >
              <div className="aspect-video bg-stone-100">
                {a.file_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.file_url}
                    alt={a.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate font-medium text-stone-900">
                    {a.name}
                  </h3>
                  <span className="shrink-0 rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                    {a.asset_type ?? "file"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-stone-400">
                  {a.campaign_id
                    ? campaignName.get(a.campaign_id) ?? "—"
                    : "Unassigned"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
