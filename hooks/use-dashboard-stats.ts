import { useMemo } from "react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { computeStats, filterSchools } from "@/services/schools-service";

/**
 * Stats for the current filters, ignoring the connection filter so the connected and
 * not-connected counts stay visible whichever of the two is being shown.
 */
export function useDashboardStats() {
  const filters = useDashboardStore((state) => state.filters);
  return useMemo(() => computeStats(filterSchools({ ...filters, connection: "All" })), [filters]);
}
