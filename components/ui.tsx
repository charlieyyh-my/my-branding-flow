import Link from "next/link";
import { label } from "@/lib/format";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-stone-100 text-stone-700 border-stone-200",
  in_review: "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  published: "bg-blue-50 text-blue-800 border-blue-200",
  planned: "bg-stone-100 text-stone-700 border-stone-200",
  active: "bg-emerald-50 text-emerald-800 border-emerald-200",
  completed: "bg-stone-100 text-stone-500 border-stone-200",
  new: "bg-blue-50 text-blue-800 border-blue-200",
  in_progress: "bg-amber-50 text-amber-800 border-amber-200",
  closed_won: "bg-emerald-50 text-emerald-800 border-emerald-200",
  closed_lost: "bg-stone-100 text-stone-500 border-stone-200",
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-800 border-amber-200",
  low: "bg-stone-100 text-stone-600 border-stone-200",
};

export function StatusBadge({ value }: { value: string | null | undefined }) {
  const key = value ?? "";
  const style = STATUS_STYLES[key] ?? "bg-stone-100 text-stone-700 border-stone-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {label(value)}
    </span>
  );
}

const PLATFORM_STYLES: Record<
  string,
  { chip: string; dot: string; mark: string }
> = {
  Facebook: {
    chip: "bg-[#eef4ff] text-[#1877F2] border-[#d7e6ff]",
    dot: "#1877F2",
    mark: "f",
  },
  Instagram: {
    chip: "bg-[#fdeef6] text-[#c13584] border-[#f6d3e6]",
    dot: "#C13584",
    mark: "◎",
  },
  Rednote: {
    chip: "bg-[#fff0f1] text-[#ff2442] border-[#ffd4d9]",
    dot: "#FF2442",
    mark: "小",
  },
};

export function PlatformBadge({ value }: { value: string | null | undefined }) {
  const key = value ?? "";
  const s = PLATFORM_STYLES[key];
  if (!s) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
        {value || "—"}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.chip}`}
    >
      <span
        className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ background: s.dot }}
        aria-hidden
      >
        {s.mark}
      </span>
      {value}
    </span>
  );
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 p-12 text-center">
      <div className="text-3xl">🗂️</div>
      <p className="font-medium text-stone-700">{title}</p>
      {hint ? <p className="max-w-sm text-sm text-stone-500">{hint}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
      <p className="font-semibold">Unable to load data. Please try again.</p>
      <p className="mt-1 text-red-600">{message}</p>
    </div>
  );
}

export function ConfigNotice() {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
      <p className="font-semibold">Database not configured yet</p>
      <p className="mt-1">
        Set <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
        and{" "}
        <code className="rounded bg-amber-100 px-1">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>
        , then apply <code className="rounded bg-amber-100 px-1">supabase/migrations/0001_init.sql</code>.
        On Vercel these are already set; locally run{" "}
        <code className="rounded bg-amber-100 px-1">vercel env pull .env.local</code>.
      </p>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`card p-5 ${className}`}>{children}</div>;
}

export function StatCard({
  label: statLabel,
  value,
  href,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  href?: string;
  accent?: string;
}) {
  const inner = (
    <div className="card p-5 transition hover:shadow-md">
      <div className="text-sm font-medium text-stone-500">{statLabel}</div>
      <div
        className="mt-2 text-3xl font-bold"
        style={{ color: accent ?? "#1c1917" }}
      >
        {value}
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </div>
  );
}
