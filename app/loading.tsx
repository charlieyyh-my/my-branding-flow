export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-64 rounded bg-[var(--surface-2)]" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-[var(--surface-2)]" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-[var(--surface-2)]" />
    </div>
  );
}
