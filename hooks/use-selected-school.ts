import { useMemo } from "react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { getSchoolById } from "@/services/schools-service";

export function useSelectedSchool() {
  const selectedSchoolId = useDashboardStore((state) => state.selectedSchoolId);
  return useMemo(
    () => (selectedSchoolId ? getSchoolById(selectedSchoolId) ?? null : null),
    [selectedSchoolId],
  );
}
