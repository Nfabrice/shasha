"use client";

import { Marker, Tooltip } from "react-leaflet";
import type { School } from "@/types/school";
import { getSchoolIcon } from "@/lib/leaflet-icons";
import { useDashboardStore } from "@/lib/store/dashboard-store";

interface SchoolMarkerProps {
  school: School;
}

export function SchoolMarker({ school }: SchoolMarkerProps) {
  const isSelected = useDashboardStore((state) => state.selectedSchoolId === school.id);
  const selectSchool = useDashboardStore((state) => state.selectSchool);

  return (
    <Marker
      position={[school.latitude, school.longitude]}
      icon={getSchoolIcon(school.phase, isSelected)}
      zIndexOffset={isSelected ? 1000 : 0}
      eventHandlers={{
        click: () => selectSchool(school.id),
      }}
    >
      <Tooltip direction="top" offset={[0, isSelected ? -48 : -38]} opacity={1} className="shasha-tooltip">
        <div className="px-0.5 text-center">
          <p className="text-[13px] font-semibold text-navy-900">{school.name}</p>
          <p className="text-[11px] font-medium text-muted-foreground">{school.province}</p>
        </div>
      </Tooltip>
    </Marker>
  );
}
