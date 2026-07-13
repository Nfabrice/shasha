import L from "leaflet";
import type { Phase } from "@/types/school";
import { PHASE_COLORS } from "@/lib/constants";

function pinSvg(color: string, colorDark: string) {
  return `
    <svg width="34" height="42" viewBox="0 0 34 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.6 0 0 7.6 0 17c0 11.5 15 23.5 16.1 24.4a1.4 1.4 0 0 0 1.8 0C19 40.5 34 28.5 34 17 34 7.6 26.4 0 17 0Z" fill="${color}"/>
      <path d="M17 0C7.6 0 0 7.6 0 17c0 11.5 15 23.5 16.1 24.4a1.4 1.4 0 0 0 1.8 0C19 40.5 34 28.5 34 17 34 7.6 26.4 0 17 0Z" fill="url(#g)" fill-opacity="0.25"/>
      <circle cx="17" cy="17" r="10.5" fill="white"/>
      <path d="M17 9.5 8.5 13.4v1.7l8.5-3.5 8.5 3.5v-1.7L17 9.5Z" fill="${colorDark}"/>
      <path d="M10 15.2v6.4c0 .5.4.9.9.9h2.2v-4.2h3.8v4.2h2.2c.5 0 .9-.4.9-.9v-6.4L17 12.6l-7 2.6Z" fill="${colorDark}"/>
      <defs>
        <linearGradient id="g" x1="17" y1="0" x2="17" y2="34" gradientUnits="userSpaceOnUse">
          <stop stop-color="white"/>
          <stop offset="1" stop-color="white" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  `;
}

const iconCache = new Map<string, L.DivIcon>();

export function getSchoolIcon(phase: Phase, isActive = false): L.DivIcon {
  const cacheKey = `${phase}-${isActive}`;
  const cached = iconCache.get(cacheKey);
  if (cached) return cached;

  const colors = PHASE_COLORS[phase];
  const size = isActive ? 42 : 34;
  const height = isActive ? 52 : 42;

  const icon = L.divIcon({
    className: isActive ? "shasha-marker shasha-marker-active" : "shasha-marker",
    html: `<div style="width:${size}px;height:${height}px;filter:drop-shadow(0 6px 8px rgba(15,23,42,0.35));">${pinSvg(
      colors.marker,
      colors.markerDark,
    )}</div>`,
    iconSize: [size, height],
    iconAnchor: [size / 2, height],
    popupAnchor: [0, -height + 6],
    tooltipAnchor: [0, -height + 10],
  });

  iconCache.set(cacheKey, icon);
  return icon;
}

const clusterIconCache = new Map<string, L.DivIcon>();

export function getClusterIcon(count: number, color: string): L.DivIcon {
  const cacheKey = `${count}-${color}`;
  const cached = clusterIconCache.get(cacheKey);
  if (cached) return cached;

  const size = count > 20 ? 54 : count > 8 ? 46 : 38;
  const fontSize = count > 99 ? 12 : 14;

  const icon = L.divIcon({
    className: "shasha-cluster-marker",
    html: `
      <div style="
        width:${size}px;height:${size}px;
        display:flex;align-items:center;justify-content:center;
        border-radius:9999px;
        background:${color};
        color:white;font-weight:700;font-size:${fontSize}px;font-family:inherit;
        box-shadow:0 8px 18px -4px rgba(15,23,42,.45);
        border:3px solid white;
      ">${count}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

  clusterIconCache.set(cacheKey, icon);
  return icon;
}
