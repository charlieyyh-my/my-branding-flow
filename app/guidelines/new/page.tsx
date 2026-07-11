import Link from "next/link";
import { getBrandGuidelines } from "@/lib/data";
import { createGuideline } from "@/lib/actions";
import { GuidelineForm } from "@/components/GuidelineForm";
import { PageHeader, Card, ConfigNotice } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function NewGuidelinePage() {
  const guidelines = await getBrandGuidelines();
  const nextOrder =
    guidelines.data.reduce((max, g) => Math.max(max, g.display_order ?? 0), 0) +
    1;

  return (
    <div>
      <PageHeader
        title="Add Guideline Section"
        action={
          <Link href="/guidelines" className="btn-secondary">
            ← Back
          </Link>
        }
      />
      {!guidelines.configured ? (
        <ConfigNotice />
      ) : (
        <Card className="max-w-2xl">
          <GuidelineForm action={createGuideline} nextOrder={nextOrder} />
        </Card>
      )}
    </div>
  );
}
