import { useMemo } from "react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { filterSchools } from "@/services/schools-service";

export function useFilteredSchools() {
  const filters = useDashboardStore((state) => state.filters);
  return useMemo(() => filterSchools(filters), [filters]);
}
