"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { ConnectionDot } from "@/components/school/connection-badge";
import type { ConnectionFilterValue } from "@/types/school";

export function ConnectionFilter() {
  const connection = useDashboardStore((state) => state.filters.connection);
  const setConnection = useDashboardStore((state) => state.setConnection);
  const stats = useDashboardStats();
  const connectedShare = stats.total > 0 ? Math.round((stats.connected / stats.total) * 100) : 0;

  const options: { value: ConnectionFilterValue; label: string; count: number; countClass: string }[] = [
    { value: "All", label: "All schools", count: stats.total, countClass: "text-navy-900" },
    { value: "Connected", label: "Connected", count: stats.connected, countClass: "text-connected" },
    { value: "Not connected", label: "Not connected", count: stats.notConnected, countClass: "text-not-connected" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div role="radiogroup" aria-label="Connection status" className="grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1">
        {options.map((option) => {
          const isActive = connection === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setConnection(option.value)}
              className="relative flex flex-col items-start gap-0.5 rounded-xl px-2.5 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {isActive && (
                <motion.span
                  layoutId="connection-filter-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  className="absolute inset-0 rounded-xl bg-card shadow-[0_1px_3px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.04)]"
                />
              )}
              <span className="relative flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-muted-foreground">
                {option.value !== "All" && <ConnectionDot connection={option.value} />}
                {option.label}
              </span>
              <span
                className={cn(
                  "relative text-[18px] font-bold leading-tight tabular-nums transition-colors",
                  isActive ? option.countClass : "text-navy-900/80",
                )}
              >
                {option.count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5">
        <div
          className="flex h-1.5 w-full overflow-hidden rounded-full bg-not-connected/85"
          role="img"
          aria-label={`${connectedShare}% of schools connected`}
        >
          <motion.div
            className="h-full rounded-r-full bg-connected"
            initial={false}
            animate={{ width: `${connectedShare}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <p className="text-[11px] font-medium text-muted-foreground">
          <span className="font-semibold text-navy-900">{connectedShare}%</span> of schools connected to Starlink
        </p>
      </div>
    </div>
  );
}
