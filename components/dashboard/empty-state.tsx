"use client";

import { SearchX } from "lucide-react";
import { useFilteredSchools } from "@/hooks/use-filtered-schools";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Button } from "@/components/ui/button";

export function MapEmptyState() {
  const schools = useFilteredSchools();
  const resetFilters = useDashboardStore((state) => state.resetFilters);

  if (schools.length > 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-400 flex items-center justify-center px-4">
      <div className="pointer-events-auto flex max-w-xs flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card/95 p-6 text-center shadow-xl backdrop-blur-sm">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-5 w-5 text-muted-foreground" />
        </span>
        <div>
          <p className="text-[14px] font-semibold text-navy-900">No schools found</p>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
            Try adjusting or resetting your filters to see more results.
          </p>
        </div>
        <Button
          onClick={resetFilters}
          variant="outline"
          className="h-9 rounded-xl border-border text-[13px]"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
