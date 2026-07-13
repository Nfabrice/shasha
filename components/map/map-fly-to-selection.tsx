"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useSelectedSchool } from "@/hooks/use-selected-school";

export function MapFlyToSelection() {
  const map = useMap();
  const school = useSelectedSchool();

  useEffect(() => {
    if (!school) return;
    map.flyTo([school.latitude, school.longitude], Math.max(map.getZoom(), 12), {
      duration: 0.9,
      easeLinearity: 0.25,
    });
  }, [school, map]);

  return null;
}
