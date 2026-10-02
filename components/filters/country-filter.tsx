"use client";

import { useMemo } from "react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { getCountries } from "@/services/schools-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_VALUE = "__all__";

export function CountryFilter() {
  const country = useDashboardStore((state) => state.filters.country);
  const setCountry = useDashboardStore((state) => state.setCountry);
  const countries = useMemo(() => getCountries(), []);

  return (
    <Select
      value={country ?? ALL_VALUE}
      onValueChange={(value) => setCountry(value === ALL_VALUE ? null : value)}
    >
      <SelectTrigger className="h-9 w-full rounded-lg border-border bg-background text-[13px] shadow-none">
        <SelectValue placeholder="All Countries" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>All Countries</SelectItem>
        {countries.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
