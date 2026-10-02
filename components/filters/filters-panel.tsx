"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { CountryFilter } from "./country-filter";
import { ProvinceFilter } from "./province-filter";
import { DistrictFilter } from "./district-filter";
import { PhaseFilter } from "./phase-filter";
import { SubscriptionFilter } from "./subscription-filter";

/** Location, phase and subscription filters, collapsed by default to leave room for the school list. */
export function FiltersPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const filters = useDashboardStore((state) => state.filters);
  const resetFilters = useDashboardStore((state) => state.resetFilters);

  const activeCount = [
    filters.country,
    filters.province,
    filters.district,
    filters.phase !== "All",
    filters.subscription !== "All",
  ].filter(Boolean).length;
  const hasAnyFilter = activeCount > 0 || filters.search !== "" || filters.connection !== "All";

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="flex items-center gap-2 rounded-lg py-1 text-[13px] font-semibold text-navy-900 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          More filters
          {activeCount > 0 && (
            <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-navy-900 px-1 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}
          />
        </button>
        {hasAnyFilter && (
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-md px-1.5 py-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-navy-900"
          >
            Reset all
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3.5 pt-3">
              <Field label="Country">
                <CountryFilter />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Province">
                  <ProvinceFilter />
                </Field>
                <Field label="District">
                  <DistrictFilter />
                </Field>
              </div>
              {/* Phase and subscription only apply to connected schools. */}
              {filters.connection !== "Not connected" && (
                <>
                  <PhaseFilter />
                  <SubscriptionFilter />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
