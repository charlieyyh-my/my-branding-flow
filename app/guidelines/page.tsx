import Link from "next/link";
import { getBrandGuidelines } from "@/lib/data";
import {
  PageHeader,
  Card,
  EmptyState,
  ErrorState,
  ConfigNotice,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function GuidelinesPage() {
  const guidelines = await getBrandGuidelines();

  return (
    <div>
      <PageHeader
        title="Brand Guidelines"
        subtitle="The reference for voice, messaging, and visual identity."
        action={
          <Link href="/guidelines/new" className="btn-primary">
            + Add Section
          </Link>
        }
      />

      {!guidelines.configured ? (
        <ConfigNotice />
      ) : guidelines.error ? (
        <ErrorState message={guidelines.error} />
      ) : guidelines.data.length === 0 ? (
        <EmptyState
          title="No guidelines yet"
          hint="Document your brand voice, pillars, and visual rules."
          action={
            <Link href="/guidelines/new" className="btn-primary">
              + Add Section
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {guidelines.data.map((g) => (
            <Card key={g.id}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-[var(--ink)]">
                  {g.section_title}
                </h2>
                <Link
                  href={`/guidelines/${g.id}`}
                  className="shrink-0 text-xs font-medium text-[var(--brand-red)]"
                >
                  Edit
                </Link>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink-soft)]">
                {g.content}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
