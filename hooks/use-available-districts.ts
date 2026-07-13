import { useMemo } from "react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { getDistrictsByProvince } from "@/services/schools-service";

export function useAvailableDistricts() {
  const province = useDashboardStore((state) => state.filters.province);
  return useMemo(() => getDistrictsByProvince(province), [province]);
}
