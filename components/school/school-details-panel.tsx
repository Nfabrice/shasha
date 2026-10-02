"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, GraduationCap, Laptop2, MapPin, Users, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useSelectedSchool } from "@/hooks/use-selected-school";
import { formatCount, formatDate, formatLocality } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ConnectionBadge, SubscriptionBadge } from "./connection-badge";

export function SchoolDetailsPanel() {
  const school = useSelectedSchool();
  const clearSelectedSchool = useDashboardStore((state) => state.clearSelectedSchool);
  const openDetailsModal = useDashboardStore((state) => state.openDetailsModal);
  const isModalOpen = useDashboardStore((state) => state.isDetailsModalOpen);

  // Escape closes the panel (the modal handles its own Escape).
  useEffect(() => {
    if (!school || isModalOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") clearSelectedSchool();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [school, isModalOpen, clearSelectedSchool]);

  return (
    <AnimatePresence>
      {school && (
        <motion.div
          key={school.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="scroll-thin absolute inset-x-0 bottom-0 top-auto z-600 max-h-[70%] w-full overflow-y-auto rounded-t-2xl border border-border/70 bg-card shadow-[0_24px_48px_-16px_rgba(15,23,42,0.35)] sm:inset-x-auto sm:right-3 sm:top-3 sm:bottom-auto sm:max-h-[calc(100%-1.5rem)] sm:w-86 sm:rounded-2xl"
        >
          <div
            className={cn(
              "h-1 w-full",
              school.connection === "Connected" ? "bg-connected" : "bg-not-connected",
            )}
          />

          <div className="px-4 pb-3.5 pt-3.5">
            <div className="flex items-center justify-between gap-2">
              <ConnectionBadge connection={school.connection} />
              <button
                type="button"
                onClick={clearSelectedSchool}
                aria-label="Close details"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h2 className="mt-2.5 text-[17px] font-bold leading-snug tracking-tight text-navy-900">{school.name}</h2>
            <p className="mt-1 flex items-start gap-1.5 text-[12px] leading-snug text-muted-foreground">
              <MapPin className="mt-px h-3.5 w-3.5 shrink-0" />
              <span>
                {formatLocality(school)} · {school.province}
                {school.country !== "Rwanda" && `, ${school.country}`}
                {school.approximateLocation && (
                  <span className="block text-[11px] text-muted-foreground/80">Approximate location on map</span>
                )}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 px-4">
            <Metric icon={GraduationCap} label="Students" value={formatCount(school.students)} />
            <Metric icon={Users} label="Teachers" value={formatCount(school.teachers)} />
            <Metric icon={Laptop2} label="Laptops" value={formatCount(school.laptops)} />
          </div>

          {school.connection === "Not connected" && (
            <p className="mx-4 mt-3 rounded-xl bg-not-connected-soft px-3 py-2.5 text-[12px] font-medium leading-snug text-not-connected-dark">
              Starlink hasn&apos;t been installed at this school yet.
            </p>
          )}

          <dl className="mt-2 flex flex-col divide-y divide-border/70 px-4">
            {school.connection === "Connected" && (
              <>
                <Row label="Phase" value={school.phase ?? "—"} />
                <Row label="Installed" value={formatDate(school.installationDate)} />
                <Row
                  label="Subscription"
                  value={
                    <span className="flex items-center gap-2">
                      {school.subscriptionEnd && (
                        <span className="text-[12px] font-medium text-muted-foreground">
                          {formatDate(school.subscriptionEnd)}
                        </span>
                      )}
                      <SubscriptionBadge school={school} />
                    </span>
                  }
                />
              </>
            )}
            <Row
              label="Headmaster"
              value={
                school.headmasterPhone ? (
                  <a href={`tel:${school.headmasterPhone.split(" / ")[0]}`} className="hover:underline">
                    {school.headmasterPhone}
                  </a>
                ) : (
                  "Not provided"
                )
              }
            />
          </dl>

          <div className="px-4 pb-4 pt-2">
            <Button
              onClick={openDetailsModal}
              className="h-10 w-full rounded-xl bg-navy-900 font-semibold text-white hover:bg-navy-800"
            >
              View full profile
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-muted/70 px-2.5 py-2">
      <span className="flex items-center gap-1 text-[10.5px] font-medium text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </span>
      <span className="text-[15px] font-bold leading-none tabular-nums text-navy-900">{value}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-3 py-2">
      <dt className="text-[12px] font-medium text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right text-[12px] font-semibold text-navy-900">{value}</dd>
    </div>
  );
}
