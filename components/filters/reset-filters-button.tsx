"use client";

import { RotateCcw } from "lucide-react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Button } from "@/components/ui/button";

export function ResetFiltersButton() {
  const resetFilters = useDashboardStore((state) => state.resetFilters);

  return (
    <Button
      onClick={resetFilters}
      className="h-10 w-full rounded-xl bg-brand-500 font-semibold text-white shadow-sm hover:bg-brand-600"
    >
      <RotateCcw className="h-4 w-4" />
      Reset Filters
    </Button>
  );
}
