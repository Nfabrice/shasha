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

export function formatPhone(phone?: string): string {
  return phone && phone.trim().length > 0 ? phone : "Not provided";
}

export function formatOptional(value?: string): string {
  return value && value.trim().length > 0 ? value : "—";
}
