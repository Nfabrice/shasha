import { Satellite } from "lucide-react";

export function StarlinkBadge() {
  return (
    <div className="pointer-events-none absolute bottom-4 right-4 z-500 hidden max-w-[260px] items-start gap-3 rounded-2xl border border-border/60 bg-card/95 p-3.5 shadow-lg backdrop-blur-sm sm:flex">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
        <Satellite className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[13px] font-semibold text-navy-900">Starlink Connectivity</p>
        <p className="text-[11px] leading-snug text-muted-foreground">
          Bringing reliable internet to remote schools across Rwanda.
        </p>
      </div>
    </div>
  );
}
