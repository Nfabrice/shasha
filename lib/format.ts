export function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Whole days from today (UTC) until an ISO date; negative once the date has passed. */
export function daysUntil(dateStr: string): number {
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((Date.parse(dateStr) - todayUtc) / 86_400_000);
}

export function formatCount(value?: number): string {
  return value === undefined ? "—" : value.toLocaleString();
}

export function formatPhone(phone?: string): string {
  return phone && phone.trim().length > 0 ? phone : "Not provided";
}

export function formatOptional(value?: string): string {
  return value && value.trim().length > 0 ? value : "—";
}

/** "Sector, District" for Rwanda; other countries have no sector level. */
export function formatLocality(school: { sector?: string; district: string }): string {
  return school.sector ? `${school.sector}, ${school.district}` : school.district;
}
