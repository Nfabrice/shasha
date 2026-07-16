import { useMemo } from "react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { getDistrictsByProvince } from "@/services/schools-service";

export function useAvailableDistricts() {
  const country = useDashboardStore((state) => state.filters.country);
  const province = useDashboardStore((state) => state.filters.province);
  return useMemo(() => getDistrictsByProvince(country, province), [country, province]);
}
