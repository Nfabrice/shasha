"use client";

import { Check, X, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import type { StatusFilterValue } from "@/types/school";

const OPTIONS: {
  label: string;
  value: StatusFilterValue;
  icon: typeof Check;
  activeClass: string;
}[] = [
  { label: "All", value: "All", icon: CircleDot, activeClass: "bg-navy-900 border-navy-900 text-white" },
  { label: "Active", value: "Active", icon: Check, activeClass: "bg-emerald-600 border-emerald-600 text-white" },
  { label: "Expired", value: "Expired", icon: X, activeClass: "bg-red-500 border-red-500 text-white" },
];

export function StatusFilter() {
  const status = useDashboardStore((state) => state.filters.status);
  const setStatus = useDashboardStore((state) => state.setStatus);

  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const isActive = status === option.value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setStatus(option.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all duration-150",
              isActive
                ? option.activeClass + " shadow-sm"
                : "border-border bg-background text-muted-foreground hover:border-brand-300 hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
