"use client";

import { MapPinOff, Satellite } from "lucide-react";
import { useFilteredSchools } from "@/hooks/use-filtered-schools";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { CONNECTION_COLORS } from "@/lib/constants";
import { isConnected } from "@/services/schools-service";

export function MapLegend() {
  const schools = useFilteredSchools();
  const basemap = useDashboardStore((state) => state.basemap);
  const connected = schools.filter(isConnected).length;
  const unconfirmed = schools.filter((school) => !school.locationConfirmed).length;
  const { Connected, "Not connected": notConnected } = CONNECTION_COLORS;
  const rows = [
    { label: "Connected", count: connected, color: Connected.base },
    { label: "Not connected", count: schools.length - connected, color: notConnected.base },
  ];

  return (
    <>
      {/* Compact legend on small screens */}
      <div className="pointer-events-none absolute right-3 top-3 z-500 flex items-center gap-3 rounded-full border border-border/70 bg-card/95 px-3 py-1.5 text-[11px] font-medium text-navy-900 shadow-md backdrop-blur-md sm:hidden">
        {rows.map((row) => (
          <span key={row.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: row.color }} />
            {row.label}
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-7 right-3 z-500 hidden w-52 flex-col gap-2.5 rounded-2xl border border-border/70 bg-card/95 p-3.5 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.35)] backdrop-blur-md sm:flex">
        <p className="flex items-center gap-2 text-[12px] font-semibold text-navy-900">
          <Satellite className="h-3.5 w-3.5 text-muted-foreground" />
          Starlink connectivity
        </p>
        <div className="flex flex-col gap-1.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-2 text-[12px]">
              <span
                className="h-3 w-3 rounded-full border-2 border-white shadow-[0_1px_3px_rgba(15,23,42,0.4)]"
                style={{ backgroundColor: row.color }}
              />
              <span className="font-medium text-navy-900">{row.label}</span>
              <span className="ml-auto font-semibold tabular-nums text-muted-foreground">{row.count}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-border/70 pt-2.5 text-[11px] leading-snug text-muted-foreground">
          <span
            className="grid h-5 w-5 shrink-0 place-items-center rounded-full p-0.75"
            style={{ background: `conic-gradient(${Connected.base} 0 40%, ${notConnected.base} 40% 100%)` }}
          >
            <span className="h-full w-full rounded-full bg-white" />
          </span>
          Cluster rings show the mix of schools inside.
        </div>
        {basemap === "satellite" && unconfirmed > 0 && (
          <div className="flex items-start gap-2 border-t border-border/70 pt-2.5 text-[11px] leading-snug text-muted-foreground">
            <MapPinOff className="mt-px h-3.5 w-3.5 shrink-0" />
            {unconfirmed === schools.length
              ? "Positions are approximate until each school's GPS location is confirmed."
              : `${unconfirmed} of ${schools.length} positions are approximate until GPS is confirmed.`}
          </div>
        )}
      </div>
    </>
  );
}
