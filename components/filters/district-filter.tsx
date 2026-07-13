"use client";

import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useAvailableDistricts } from "@/hooks/use-available-districts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_VALUE = "__all__";

export function DistrictFilter() {
  const district = useDashboardStore((state) => state.filters.district);
  const setDistrict = useDashboardStore((state) => state.setDistrict);
  const districts = useAvailableDistricts();

  return (
    <Select
      value={district ?? ALL_VALUE}
      onValueChange={(value) => setDistrict(value === ALL_VALUE ? null : value)}
    >
      <SelectTrigger className="h-10 w-full rounded-xl border-border bg-background text-sm shadow-none focus-visible:ring-brand-400">
        <SelectValue placeholder="All Districts" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>All Districts</SelectItem>
        {districts.map((d) => (
          <SelectItem key={d} value={d}>
            {d}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
