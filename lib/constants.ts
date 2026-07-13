import type { Phase, SchoolStatus } from "@/types/school";

export const PHASE_ORDER: Phase[] = ["Phase I", "Phase II", "Phase III"];

export const PHASE_COLORS: Record<Phase, { marker: string; markerDark: string }> = {
  "Phase I": { marker: "#2563eb", markerDark: "#1d4ed8" },
  "Phase II": { marker: "#f97316", markerDark: "#ea580c" },
  "Phase III": { marker: "#16a34a", markerDark: "#15803d" },
};

export const PHASE_WINDOWS: Record<Phase, string> = {
  "Phase I": "Jan – Apr 2025",
  "Phase II": "May – Aug 2025",
  "Phase III": "Sep – Dec 2025",
};

export const STATUS_COLORS: Record<SchoolStatus, { text: string; bg: string; border: string }> = {
  Active: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  Expired: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
};

export const RWANDA_CENTER: [number, number] = [-1.9403, 29.8739];

export const RWANDA_BOUNDS: [[number, number], [number, number]] = [
  [-2.95, 28.75],
  [-1.0, 30.95],
];

export const DEFAULT_ZOOM = 8.3;
export const MIN_ZOOM = 7;
export const MAX_ZOOM = 17;
