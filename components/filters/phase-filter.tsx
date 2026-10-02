"use client";

import { useDashboardStore } from "@/lib/store/dashboard-store";
import { PHASE_ORDER } from "@/lib/constants";
import type { PhaseFilterValue } from "@/types/school";
import { ChipGroup } from "./chip-group";

const OPTIONS: { label: string; value: PhaseFilterValue }[] = [
  { label: "All", value: "All" },
  ...PHASE_ORDER.map((phase) => ({ label: phase, value: phase })),
];

export function PhaseFilter() {
  const phase = useDashboardStore((state) => state.filters.phase);
  const setPhase = useDashboardStore((state) => state.setPhase);

  return <ChipGroup label="Installation phase" value={phase} options={OPTIONS} onChange={setPhase} />;
}
