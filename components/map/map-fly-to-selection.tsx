"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useSelectedSchool } from "@/hooks/use-selected-school";

// Zoom past the unclustering threshold so the selected school shows as its own marker.
const SELECTION_ZOOM = 13;
// Half the details panel width (plus margin) on screens where it floats on the right.
const PANEL_OFFSET_PX = 180;

export function MapFlyToSelection() {
  const map = useMap();
  const school = useSelectedSchool();

  useEffect(() => {
    if (!school) return;
    const zoom = Math.max(map.getZoom(), SELECTION_ZOOM);
    const hasSidePanel = map.getContainer().clientWidth >= 640;
    // Shift the view so the marker sits beside the details panel instead of under it.
    const target = hasSidePanel
      ? map.unproject(map.project([school.latitude, school.longitude], zoom).add([PANEL_OFFSET_PX, 0]), zoom)
      : ([school.latitude, school.longitude] as [number, number]);
    map.flyTo(target, zoom, { duration: 0.9, easeLinearity: 0.25 });
  }, [school, map]);

  return null;
}
