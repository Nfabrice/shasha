"use client";

import { useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { LocateFixed, Maximize, Minimize } from "lucide-react";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useSyncSelectionWithFilters } from "@/hooks/use-sync-selection-with-filters";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { SchoolDetailsPanel } from "@/components/school/school-details-panel";
import { MapEmptyState } from "@/components/dashboard/empty-state";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MapSkeleton } from "./map-skeleton";
import { MapLegend } from "./map-legend";

const MapCanvas = dynamic(() => import("./map-canvas").then((mod) => mod.MapCanvas), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggle } = useFullscreen(containerRef);
  const requestFit = useDashboardStore((state) => state.requestFit);
  useSyncSelectionWithFilters();

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <MapCanvas />

      <div className="absolute left-3 top-23.5 z-500 flex flex-col gap-2">
        <MapButton label="Fit to visible schools" onClick={requestFit}>
          <LocateFixed className="h-4 w-4" />
        </MapButton>
        <MapButton label={isFullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={toggle}>
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </MapButton>
      </div>

      <MapEmptyState />
      <MapLegend />
      <SchoolDetailsPanel />
    </div>
  );
}

function MapButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white text-navy-900 shadow-[0_8px_24px_-10px_rgba(15,23,42,0.3)] transition-colors hover:bg-muted"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
