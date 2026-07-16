import { useMemo } from "react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { getProvinces } from "@/services/schools-service";

export function useAvailableProvinces() {
  const country = useDashboardStore((state) => state.filters.country);
  return useMemo(() => getProvinces(country), [country]);
}
