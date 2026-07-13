"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Maximize, Minimize } from "lucide-react";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useSyncSelectionWithFilters } from "@/hooks/use-sync-selection-with-filters";
import { SchoolDetailsPanel } from "@/components/school/school-details-panel";
import { MapEmptyState } from "@/components/dashboard/empty-state";
import { MapSkeleton } from "./map-skeleton";
import { StarlinkBadge } from "./starlink-badge";

const MapCanvas = dynamic(() => import("./map-canvas").then((mod) => mod.MapCanvas), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggle } = useFullscreen(containerRef);
  useSyncSelectionWithFilters();

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-sm"
    >
      <MapCanvas />

      <button
        type="button"
        onClick={toggle}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        className="absolute left-3 top-[86px] z-500 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-navy-900 shadow-md transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
      >
        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </button>

      <MapEmptyState />
      <SchoolDetailsPanel />
      <StarlinkBadge />
    </div>
  );
}
