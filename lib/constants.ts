import type { ConnectionStatus, Phase } from "@/types/school";

export const PHASE_ORDER: Phase[] = ["Phase I", "Phase II", "Phase III", "Phase IV", "Phase V"];

// Keep in sync with --color-connected / --color-not-connected in app/globals.css.
// Leaflet markers are plain HTML strings, so they need the raw values.
export const CONNECTION_COLORS: Record<ConnectionStatus, { base: string; dark: string }> = {
  Connected: { base: "#2563eb", dark: "#1d4ed8" },
  "Not connected": { base: "#dc2626", dark: "#b91c1c" },
};

// Subscriptions ending within this many days are flagged as expiring soon.
export const EXPIRING_SOON_DAYS = 30;

// Initial center/zoom before MapFitBounds computes the real extent from school data.
export const RWANDA_CENTER: [number, number] = [-1.9403, 29.8739];

export const DEFAULT_ZOOM = 8;
export const MIN_ZOOM = 3;
export const MAX_ZOOM = 17;
