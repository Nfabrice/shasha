import L from "leaflet";
import type { ConnectionStatus } from "@/types/school";
import { CONNECTION_COLORS } from "@/lib/constants";

export type MarkerState = "default" | "hover" | "selected";

const iconCache = new Map<string, L.DivIcon>();

export function getSchoolIcon(connection: ConnectionStatus, state: MarkerState = "default"): L.DivIcon {
  const cacheKey = `${connection}-${state}`;
  const cached = iconCache.get(cacheKey);
  if (cached) return cached;

  const size = state === "selected" ? 24 : 16;
  const icon = L.divIcon({
    className: "shasha-marker",
    html: `<span class="shasha-dot${state === "default" ? "" : ` shasha-dot-${state}`}" style="--dot:${
      CONNECTION_COLORS[connection].base
    }"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    tooltipAnchor: [0, -size / 2 - 4],
  });

  iconCache.set(cacheKey, icon);
  return icon;
}

const clusterIconCache = new Map<string, L.DivIcon>();

/** Cluster bubble whose ring is split by the share of connected schools. */
export function getClusterIcon(count: number, connectedCount: number): L.DivIcon {
  const cacheKey = `${count}-${connectedCount}`;
  const cached = clusterIconCache.get(cacheKey);
  if (cached) return cached;

  const size = count > 40 ? 58 : count > 15 ? 50 : count > 5 ? 44 : 38;
  const fontSize = count > 99 ? 12 : 13;
  const share = (connectedCount / count) * 100;
  const { Connected, "Not connected": notConnected } = CONNECTION_COLORS;

  const icon = L.divIcon({
    className: "shasha-cluster-marker",
    html: `<div class="shasha-cluster" style="background:conic-gradient(${Connected.base} 0 ${share}%, ${
      notConnected.base
    } ${share}% 100%)"><span style="font-size:${fontSize}px">${count}</span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

  clusterIconCache.set(cacheKey, icon);
  return icon;
}
