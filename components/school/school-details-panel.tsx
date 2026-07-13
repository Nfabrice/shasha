"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  CalendarClock,
  CalendarDays,
  ChevronRight,
  GraduationCap,
  Laptop2,
  MapPin,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useSelectedSchool } from "@/hooks/use-selected-school";
import { PHASE_COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";

export function SchoolDetailsPanel() {
  const school = useSelectedSchool();
  const clearSelectedSchool = useDashboardStore((state) => state.clearSelectedSchool);
  const openDetailsModal = useDashboardStore((state) => state.openDetailsModal);

  return (
    <AnimatePresence>
      {school && (
        <motion.div
          key={school.id}
          initial={{ opacity: 0, y: 24, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 bottom-0 top-auto z-600 max-h-[70vh] w-full overflow-y-auto rounded-t-2xl border border-border/70 bg-card p-4 shadow-xl sm:inset-x-auto sm:top-4 sm:right-4 sm:bottom-auto sm:max-h-none sm:w-[320px] sm:rounded-2xl"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${PHASE_COLORS[school.phase].marker}1a` }}
              >
                <Building2 className="h-4 w-4" style={{ color: PHASE_COLORS[school.phase].marker }} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-bold leading-tight text-navy-900">
                  {school.name}
                </p>
                <p className="text-[11px] font-medium text-muted-foreground">{school.phase}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearSelectedSchool}
              aria-label="Close details"
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <DetailRow icon={MapPin} label="Province" value={school.province} />
            <DetailRow icon={MapPin} label="District" value={school.district} />
            <DetailRow icon={MapPin} label="Sector" value={school.sector} />
            <DetailRow icon={GraduationCap} label="Students" value={school.students.toLocaleString()} />
            <DetailRow icon={Users} label="Teachers" value={school.teachers.toLocaleString()} />
            <DetailRow icon={Laptop2} label="Laptops" value={school.laptops.toLocaleString()} />
            <DetailRow icon={CalendarDays} label="Installed" value={formatDate(school.installationDate)} />
            <DetailRow
              icon={CalendarClock}
              label="Subscription Ends"
              value={formatDate(school.subscriptionEnd)}
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[12px] font-medium text-muted-foreground">Status</span>
              <StatusBadge status={school.status} />
            </div>
          </div>

          <Button
            onClick={openDetailsModal}
            className="mt-4 h-10 w-full rounded-xl bg-brand-500 font-semibold text-white hover:bg-brand-600"
          >
            View Full Details
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="truncate text-[12px] font-semibold text-navy-900">{value}</span>
    </div>
  );
}
