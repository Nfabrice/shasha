"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useFilteredSchools } from "./use-filtered-schools";

/** Clears the selected school if it drops out of the active filter set. */
export function useSyncSelectionWithFilters() {
  const filteredSchools = useFilteredSchools();
  const selectedSchoolId = useDashboardStore((state) => state.selectedSchoolId);
  const clearSelectedSchool = useDashboardStore((state) => state.clearSelectedSchool);

  useEffect(() => {
    if (!selectedSchoolId) return;
    const stillVisible = filteredSchools.some((school) => school.id === selectedSchoolId);
    if (!stillVisible) clearSelectedSchool();
  }, [filteredSchools, selectedSchoolId, clearSelectedSchool]);
}
