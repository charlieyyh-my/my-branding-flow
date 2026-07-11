// Date + label helpers. All date math is done on ISO `YYYY-MM-DD` strings in
// local terms to avoid timezone drift on `date`-typed columns.

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** Monday of the week containing `d`. */
export function mondayOf(d: Date): Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = copy.getDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

export function addDays(d: Date, n: number): Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  copy.setDate(copy.getDate() + n);
  return copy;
}

/** The 7 ISO dates (Mon–Sun) for the week containing `anchor`. */
export function weekDates(anchor: Date): string[] {
  const mon = mondayOf(anchor);
  return Array.from({ length: 7 }, (_, i) => toISODate(addDays(mon, i)));
}

export const WEEKDAY_LABELS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export function formatDate(s: string | null): string {
  if (!s) return "—";
  const d = parseISODate(s);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDayMonth(s: string): string {
  const d = parseISODate(s);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatDateTime(s: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  in_review: "In Review",
  approved: "Approved",
  published: "Published",
  planned: "Planned",
  active: "Active",
  completed: "Completed",
  new: "New",
  in_progress: "In Progress",
  closed_won: "Closed — Won",
  closed_lost: "Closed — Lost",
};

export function label(value: string | null | undefined): string {
  if (!value) return "—";
  return STATUS_LABELS[value] ?? value;
}
