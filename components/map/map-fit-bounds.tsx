"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { getAllSchools } from "@/services/schools-service";

export function MapFitBounds() {
  const map = useMap();

  useEffect(() => {
    const points = getAllSchools().map((school): [number, number] => [school.latitude, school.longitude]);
    if (points.length === 0) return;
    map.fitBounds(points, { padding: [28, 28] });
  }, [map]);

  return null;
}
