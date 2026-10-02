"use client";

import type { ReactNode } from "react";
import { CalendarClock, GraduationCap, MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useSelectedSchool } from "@/hooks/use-selected-school";
import { formatCount, formatDate, formatLocality, formatOptional, formatPhone } from "@/lib/format";
import { ConnectionBadge, SubscriptionBadge } from "./connection-badge";

export function SchoolDetailsModal() {
  const school = useSelectedSchool();
  const isOpen = useDashboardStore((state) => state.isDetailsModalOpen);
  const closeDetailsModal = useDashboardStore((state) => state.closeDetailsModal);

  if (!school) return null;
  const isConnected = school.connection === "Connected";
  // The sheet uses 0 for headcounts it doesn't have.
  const hasHeadcounts = Boolean(school.headcount2024 || school.headcount2025);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDetailsModal()}>
      <DialogContent className="scroll-thin max-h-[88vh] gap-0 overflow-y-auto rounded-2xl p-0 sm:max-w-lg">
        <div className={isConnected ? "h-1 w-full bg-connected" : "h-1 w-full bg-not-connected"} />
        <DialogHeader className="gap-2 px-6 pb-5 pt-5 text-left">
          <ConnectionBadge connection={school.connection} />
          <DialogTitle className="text-xl font-bold tracking-tight text-navy-900">{school.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {formatLocality(school)} · {school.province}, {school.country}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 px-6">
          <Metric label="Students" value={formatCount(school.students)} />
          <Metric label="Teachers" value={formatCount(school.teachers)} />
          <Metric label="Laptops" value={formatCount(school.laptops)} />
        </div>

        <div className="flex flex-col gap-6 px-6 pb-6 pt-6">
          <Section title="Starlink" icon={CalendarClock}>
            {isConnected ? (
              <InfoGrid
                items={[
                  { label: "Phase", value: school.phase ?? "—" },
                  { label: "Installed", value: formatDate(school.installationDate) },
                  { label: "Subscription ends", value: formatDate(school.subscriptionEnd) },
                  { label: "Subscription", value: <SubscriptionBadge school={school} /> },
                ]}
              />
            ) : (
              <p className="rounded-xl bg-not-connected-soft px-3.5 py-3 text-[13px] font-medium text-not-connected-dark">
                Not connected yet. There is no installation or subscription for this school.
              </p>
            )}
          </Section>

          {(hasHeadcounts || school.equipmentNotes) && (
            <Section title="School" icon={GraduationCap}>
              <InfoGrid
                items={[
                  ...(hasHeadcounts
                    ? [
                        { label: "Headcount 2024", value: formatCount(school.headcount2024 || undefined) },
                        { label: "Headcount 2025", value: formatCount(school.headcount2025 || undefined) },
                      ]
                    : []),
                  ...(school.equipmentNotes
                    ? [{ label: "Equipment notes", value: school.equipmentNotes, wide: true }]
                    : []),
                ]}
              />
            </Section>
          )}

          <Section title="Location" icon={MapPin}>
            <InfoGrid
              items={[
                { label: "Country", value: school.country },
                { label: "Province", value: school.province },
                { label: "District", value: school.district },
                { label: "Sector", value: formatOptional(school.sector) },
                {
                  label: "Map position",
                  value: school.locationConfirmed
                    ? "Confirmed GPS location"
                    : "Approximate, near the center of its sector or district (GPS not yet confirmed)",
                  wide: true,
                },
              ]}
            />
          </Section>

          <Section title="Contact" icon={Phone}>
            <InfoGrid
              items={[
                {
                  label: "Headmaster phone",
                  value: school.headmasterPhone ? (
                    <a href={`tel:${school.headmasterPhone.split(" / ")[0]}`} className="hover:underline">
                      {school.headmasterPhone}
                    </a>
                  ) : (
                    formatPhone(school.headmasterPhone)
                  ),
                  wide: true,
                },
              ]}
            />
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-muted/50 px-3 py-2.5">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <span className="text-[18px] font-bold leading-none tabular-nums text-navy-900">{value}</span>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-[13px] font-semibold text-navy-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function InfoGrid({ items }: { items: { label: string; value: ReactNode; wide?: boolean }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5">
      {items.map((item) => (
        <div key={item.label} className={item.wide ? "col-span-2 flex flex-col gap-1" : "flex flex-col gap-1"}>
          <dt className="text-[11px] font-medium text-muted-foreground">{item.label}</dt>
          <dd className="text-[13px] font-semibold text-navy-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
