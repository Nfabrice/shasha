import { useMemo } from "react";
import { computeStats } from "@/services/schools-service";
import { useFilteredSchools } from "./use-filtered-schools";

export function useDashboardStats() {
  const filteredSchools = useFilteredSchools();
  return useMemo(() => computeStats(filteredSchools), [filteredSchools]);
}
