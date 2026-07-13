import { School2 } from "lucide-react";
import { PHASE_COLORS, PHASE_ORDER, PHASE_WINDOWS } from "@/lib/constants";

export function Legend() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <p className="mb-3 text-[13px] font-semibold text-navy-900">Installation Phase</p>
      <div className="flex flex-col gap-2.5">
        {PHASE_ORDER.map((phase) => (
          <div key={phase} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${PHASE_COLORS[phase].marker}1a` }}
              >
                <School2 className="h-3.5 w-3.5" style={{ color: PHASE_COLORS[phase].marker }} />
              </span>
              <span className="text-[13px] font-medium text-foreground">{phase}</span>
            </div>
            <span className="text-[11px] text-muted-foreground">{PHASE_WINDOWS[phase]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
