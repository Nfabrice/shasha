"use client";

import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useAvailableProvinces } from "@/hooks/use-available-provinces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_VALUE = "__all__";

export function ProvinceFilter() {
  const province = useDashboardStore((state) => state.filters.province);
  const setProvince = useDashboardStore((state) => state.setProvince);
  const provinces = useAvailableProvinces();

  return (
    <Select
      value={province ?? ALL_VALUE}
      onValueChange={(value) => setProvince(value === ALL_VALUE ? null : value)}
    >
      <SelectTrigger className="h-10 w-full rounded-xl border-border bg-background text-sm shadow-none focus-visible:ring-brand-400">
        <SelectValue placeholder="All Provinces" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>All Provinces</SelectItem>
        {provinces.map((p) => (
          <SelectItem key={p} value={p}>
            {p} Province
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
