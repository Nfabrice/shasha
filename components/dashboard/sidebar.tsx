import { Logo } from "./logo";
import { SearchFilter } from "@/components/filters/search-filter";
import { ConnectionFilter } from "@/components/filters/connection-filter";
import { FiltersPanel } from "@/components/filters/filters-panel";
import { SchoolList } from "@/components/school/school-list";

export function Sidebar() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-5 border-b border-border/70 px-5 pb-5 pt-6">
        <Logo />
        <div className="flex flex-col gap-1">
          <h1 className="text-[20px] font-bold leading-tight tracking-tight text-navy-900">School Connectivity</h1>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Starlink internet across Shasha Network schools.
          </p>
        </div>
        <ConnectionFilter />
      </div>

      <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-4">
        <SearchFilter />
        <FiltersPanel />
      </div>

      <SchoolList />
    </div>
  );
}
