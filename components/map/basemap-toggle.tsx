"use client";

import { useEffect } from "react";
import { Globe, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardStore, type Basemap } from "@/lib/store/dashboard-store";

const STORAGE_KEY = "shasha-basemap";

const OPTIONS: { value: Basemap; label: string; icon: typeof MapIcon }[] = [
  { value: "map", label: "Map", icon: MapIcon },
  { value: "satellite", label: "Satellite", icon: Globe },
];

export function BasemapToggle() {
  const basemap = useDashboardStore((state) => state.basemap);
  const setBasemap = useDashboardStore((state) => state.setBasemap);

  // Remember each viewer's choice; storage can be unavailable (private mode), which is fine.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "map" || saved === "satellite") setBasemap(saved);
    } catch {}
  }, [setBasemap]);

  const choose = (value: Basemap) => {
    setBasemap(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {}
  };

  return (
    <div
      role="radiogroup"
      aria-label="Map style"
      className="absolute bottom-10 left-3 z-500 flex gap-0.5 rounded-xl border border-border bg-white p-0.5 shadow-[0_8px_24px_-10px_rgba(15,23,42,0.3)]"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = basemap === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => choose(value)}
            className={cn(
              "flex items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 text-[12px] font-semibold transition-colors",
              isActive ? "bg-navy-900 text-white" : "text-muted-foreground hover:bg-muted hover:text-navy-900",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
