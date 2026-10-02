"use client";

import { memo, useEffect, useMemo, useRef } from "react";
import { CalendarX2, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatLocality } from "@/lib/format";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useFilteredSchools } from "@/hooks/use-filtered-schools";
import { useIsClient } from "@/hooks/use-is-client";
import { getSubscriptionStatus } from "@/services/schools-service";
import type { ConnectionStatus, School } from "@/types/school";
import { ConnectionDot } from "./connection-badge";

const GROUP_ORDER: ConnectionStatus[] = ["Connected", "Not connected"];

/** Filtered schools grouped by connection status; clicking one selects it on the map. */
export function SchoolList() {
  const schools = useFilteredSchools();
  const resetFilters = useDashboardStore((state) => state.resetFilters);

  const groups = useMemo(
    () =>
      GROUP_ORDER.map((connection) => ({
        connection,
        schools: schools
          .filter((school) => school.connection === connection)
          .sort((a, b) => a.name.localeCompare(b.name)),
      })).filter((group) => group.schools.length > 0),
    [schools],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-baseline justify-between px-5 pb-1 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Schools</p>
        <p className="text-[11px] font-medium tabular-nums text-muted-foreground">
          {schools.length.toLocaleString()} shown
        </p>
      </div>

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        {groups.map((group) => (
          <section key={group.connection} aria-label={group.connection}>
            <h3 className="sticky top-0 z-10 flex items-center gap-2 bg-card/95 px-2 pb-1.5 pt-3 text-[11px] font-semibold text-navy-600 backdrop-blur-sm">
              <ConnectionDot connection={group.connection} />
              {group.connection}
              <span className="ml-auto font-medium tabular-nums text-muted-foreground">{group.schools.length}</span>
            </h3>
            <ul className="flex flex-col gap-0.5">
              {group.schools.map((school) => (
                <SchoolListItem key={school.id} school={school} />
              ))}
            </ul>
          </section>
        ))}

        {schools.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-muted">
              <SearchX className="h-4 w-4 text-muted-foreground" />
            </span>
            <p className="text-[13px] font-semibold text-navy-900">No schools match</p>
            <p className="text-[12px] text-muted-foreground">Try a different search or clear the filters.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-1 text-[12px] font-semibold text-connected hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const SchoolListItem = memo(function SchoolListItem({ school }: { school: School }) {
  const isSelected = useDashboardStore((state) => state.selectedSchoolId === school.id);
  const selectSchool = useDashboardStore((state) => state.selectSchool);
  const setHoveredSchool = useDashboardStore((state) => state.setHoveredSchool);
  const setMobileFiltersOpen = useDashboardStore((state) => state.setMobileFiltersOpen);
  const ref = useRef<HTMLButtonElement>(null);
  const isConnected = school.connection === "Connected";
  // Expiry depends on today's date, so only show it in the browser to keep hydration consistent.
  const isClient = useIsClient();
  const isExpired = isClient && getSubscriptionStatus(school) === "Expired";

  // Keep the selected school visible when it was picked on the map.
  useEffect(() => {
    if (isSelected) ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [isSelected]);

  return (
    <li>
      <button
        ref={ref}
        type="button"
        aria-current={isSelected ? "true" : undefined}
        onClick={() => {
          selectSchool(school.id);
          setMobileFiltersOpen(false);
        }}
        onMouseEnter={() => setHoveredSchool(school.id)}
        onMouseLeave={() => setHoveredSchool(null)}
        onFocus={() => setHoveredSchool(school.id)}
        onBlur={() => setHoveredSchool(null)}
        className={cn(
          "group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left outline-none transition-colors duration-150",
          "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50",
          isSelected && (isConnected ? "bg-connected-soft hover:bg-connected-soft" : "bg-not-connected-soft hover:bg-not-connected-soft"),
        )}
      >
        <span
          className={cn(
            "absolute inset-y-2 left-0 w-[3px] rounded-full transition-opacity",
            isConnected ? "bg-connected" : "bg-not-connected",
            isSelected ? "opacity-100" : "opacity-0",
          )}
        />
        <ConnectionDot connection={school.connection} className="h-2.5 w-2.5" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-navy-900">{school.name}</span>
          <span className="block truncate text-[11.5px] text-muted-foreground">
            {formatLocality(school)} · {school.country === "Rwanda" ? school.province : school.country}
          </span>
        </span>
        {isExpired ? (
          <span
            title="Subscription expired"
            className="flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-amber-700"
          >
            <CalendarX2 className="h-3 w-3" />
            Expired
          </span>
        ) : (
          school.phase && (
            <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10.5px] font-semibold text-navy-600 group-hover:bg-card">
              {school.phase}
            </span>
          )
        )}
      </button>
    </li>
  );
});
