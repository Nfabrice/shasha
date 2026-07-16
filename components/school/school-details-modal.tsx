"use client";

import type { ReactNode } from "react";
import {
  Building2,
  CalendarClock,
  GraduationCap,
  Layers,
  MapPin,
  Phone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useSelectedSchool } from "@/hooks/use-selected-school";
import { PHASE_COLORS } from "@/lib/constants";
import { formatDate, formatOptional, formatPhone } from "@/lib/format";
import { StatusBadge } from "./status-badge";

export function SchoolDetailsModal() {
  const school = useSelectedSchool();
  const isOpen = useDashboardStore((state) => state.isDetailsModalOpen);
  const closeDetailsModal = useDashboardStore((state) => state.closeDetailsModal);

  if (!school) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDetailsModal()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${PHASE_COLORS[school.phase].marker}1a` }}
            >
              <Building2 className="h-5 w-5" style={{ color: PHASE_COLORS[school.phase].marker }} />
            </span>
            <div className="min-w-0 text-left">
              <DialogTitle className="text-lg">{school.name}</DialogTitle>
              <DialogDescription>
                {school.sector ? `${school.sector}, ` : ""}
                {school.district} — {school.province} Province
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-5 pt-1">
          <Section title="General Information" icon={MapPin}>
            <InfoGrid
              items={[
                { label: "Province", value: school.province },
                { label: "District", value: school.district },
                { label: "Sector", value: formatOptional(school.sector) },
                { label: "Phase", value: school.phase },
              ]}
            />
          </Section>

          <Separator />

          <Section title="School Statistics" icon={GraduationCap}>
            <InfoGrid
              items={[
                { label: "Students", value: school.students.toLocaleString() },
                { label: "Teachers", value: school.teachers.toLocaleString() },
                { label: "Laptops", value: school.laptops.toLocaleString() },
              ]}
            />
          </Section>

          <Separator />

          <Section title="Installation" icon={Layers}>
            <InfoGrid
              items={[
                { label: "Phase", value: school.phase },
                { label: "Installation Date", value: formatDate(school.installationDate) },
              ]}
            />
          </Section>

          <Separator />

          <Section title="Subscription" icon={CalendarClock}>
            <InfoGrid
              items={[
                { label: "Subscription End", value: formatDate(school.subscriptionEnd) },
                { label: "Status", value: <StatusBadge status={school.status} /> },
              ]}
            />
          </Section>

          <Separator />

          <Section title="Contact Information" icon={Phone}>
            <InfoGrid items={[{ label: "Headmaster Phone", value: formatPhone(school.headmasterPhone) }]} />
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-500" />
        <h3 className="text-[13px] font-semibold text-navy-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <dt className="text-[11px] font-medium text-muted-foreground">{item.label}</dt>
          <dd className="text-[13px] font-semibold text-navy-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
