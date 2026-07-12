import Link from "next/link";
import { getContentItems, getCampaigns } from "@/lib/data";
import { PageHeader, EmptyState, ErrorState, ConfigNotice } from "@/components/ui";
import { ContentListClient } from "@/components/ContentListClient";

export const dynamic = "force-dynamic";

export default async function ContentListPage() {
  const [items, campaigns] = await Promise.all([
    getContentItems(),
    getCampaigns(),
  ]);

  return (
    <div>
      <PageHeader
        title="Content Items"
        subtitle="Filter by channel or status, and change status inline."
        action={
          <Link href="/content/new" className="btn-primary">
            + New Content Item
          </Link>
        }
      />

      {!items.configured ? (
        <ConfigNotice />
      ) : items.error ? (
        <ErrorState message={items.error} />
      ) : items.data.length === 0 ? (
        <EmptyState
          icon="✍️"
          title="No content yet"
          hint="Create your first content item to start planning the week."
          action={
            <Link href="/content/new" className="btn-primary">
              + New Content Item
            </Link>
          }
        />
      ) : (
        <ContentListClient items={items.data} campaigns={campaigns.data} />
      )}
    </div>
  );
}
