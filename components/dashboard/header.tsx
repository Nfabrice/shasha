"use client";

import { List } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Logo } from "./logo";
import { Sidebar } from "./sidebar";

export function Header() {
  const isOpen = useDashboardStore((state) => state.isMobileFiltersOpen);
  const setOpen = useDashboardStore((state) => state.setMobileFiltersOpen);

  return (
    <header className="flex items-center justify-between border-b border-border/60 bg-card px-4 py-3 md:hidden">
      <Logo />
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Open school list and filters"
            className="flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-[13px] font-semibold text-navy-900 transition-colors hover:bg-muted"
          >
            <List className="h-4 w-4" />
            Schools
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[340px] gap-0 p-0 sm:w-[380px]">
          <SheetTitle className="sr-only">Schools and filters</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>
    </header>
  );
}
