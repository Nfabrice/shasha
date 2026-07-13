"use client";

import { Menu } from "lucide-react";
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
            aria-label="Open filters"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-navy-900 transition-colors hover:bg-brand-50"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[320px] gap-0 p-0 sm:w-[360px]">
          <SheetTitle className="sr-only">Filters and Legend</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>
    </header>
  );
}
