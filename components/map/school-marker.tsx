"use client";

import { Marker, Tooltip } from "react-leaflet";
import type { School } from "@/types/school";
import { getSchoolIcon } from "@/lib/leaflet-icons";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { ConnectionDot } from "@/components/school/connection-badge";

interface SchoolMarkerProps {
  school: School;
}

export function SchoolMarker({ school }: SchoolMarkerProps) {
  const isSelected = useDashboardStore((state) => state.selectedSchoolId === school.id);
  const isHovered = useDashboardStore((state) => state.hoveredSchoolId === school.id);
  const selectSchool = useDashboardStore((state) => state.selectSchool);
  const state = isSelected ? "selected" : isHovered ? "hover" : "default";

  return (
    <Marker
      position={[school.latitude, school.longitude]}
      icon={getSchoolIcon(school.connection, state)}
      zIndexOffset={isSelected ? 1000 : isHovered ? 500 : 0}
      eventHandlers={{
        click: () => selectSchool(school.id),
      }}
    >
      <Tooltip direction="top" opacity={1} className="shasha-tooltip">
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] font-semibold text-navy-900">{school.name}</p>
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <ConnectionDot connection={school.connection} />
            {school.connection}
            {school.phase ? ` · ${school.phase}` : ""}
            {` · ${school.district}`}
          </p>
        </div>
      </Tooltip>
    </Marker>
  );
}
