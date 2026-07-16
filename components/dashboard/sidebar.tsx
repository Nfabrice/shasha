import { Logo } from "./logo";
import { Legend } from "./legend";
import { SearchFilter } from "@/components/filters/search-filter";
import { CountryFilter } from "@/components/filters/country-filter";
import { ProvinceFilter } from "@/components/filters/province-filter";
import { DistrictFilter } from "@/components/filters/district-filter";
import { PhaseFilter } from "@/components/filters/phase-filter";
import { StatusFilter } from "@/components/filters/status-filter";
import { ResetFiltersButton } from "@/components/filters/reset-filters-button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar() {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-6 px-5 py-6">
        <Logo />

        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-bold leading-[1.15] tracking-tight text-navy-900">
            Connecting Schools Across Rwanda
          </h1>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Bridging education through connectivity. Empowering learners. Building futures.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Filters
          </p>

          <div className="flex flex-col gap-3">
            <SearchFilter />

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Country</label>
              <CountryFilter />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Province</label>
              <ProvinceFilter />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">District</label>
              <DistrictFilter />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Phase</label>
              <PhaseFilter />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Status</label>
              <StatusFilter />
            </div>

            <ResetFiltersButton />
          </div>
        </div>

        <Legend />
      </div>
    </ScrollArea>
  );
}
