"use client";

import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import type { PhaseFilterValue } from "@/types/school";

const OPTIONS: { label: string; value: PhaseFilterValue; activeClass: string }[] = [
  { label: "All", value: "All", activeClass: "bg-navy-900 border-navy-900 text-white" },
  { label: "Phase I", value: "Phase I", activeClass: "bg-blue-600 border-blue-600 text-white" },
  { label: "Phase II", value: "Phase II", activeClass: "bg-orange-500 border-orange-500 text-white" },
  { label: "Phase III", value: "Phase III", activeClass: "bg-emerald-600 border-emerald-600 text-white" },
];

export function PhaseFilter() {
  const phase = useDashboardStore((state) => state.filters.phase);
  const setPhase = useDashboardStore((state) => state.setPhase);

  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const isActive = phase === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setPhase(option.value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all duration-150",
              isActive
                ? option.activeClass + " shadow-sm"
                : "border-border bg-background text-muted-foreground hover:border-brand-300 hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
