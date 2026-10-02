"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useFilteredSchools } from "@/hooks/use-filtered-schools";

/** Fits the map to the visible schools on load, whenever the location filters change, and on request. */
export function MapFitBounds() {
  const map = useMap();
  const schools = useFilteredSchools();
  const country = useDashboardStore((state) => state.filters.country);
  const province = useDashboardStore((state) => state.filters.province);
  const district = useDashboardStore((state) => state.filters.district);
  const fitRequest = useDashboardStore((state) => state.fitRequest);
  const schoolsRef = useRef(schools);
  const hasFitted = useRef(false);

  useEffect(() => {
    schoolsRef.current = schools;
  }, [schools]);

  useEffect(() => {
    const points = schoolsRef.current.map((school): [number, number] => [school.latitude, school.longitude]);
    if (points.length === 0) return;
    if (hasFitted.current) {
      map.flyToBounds(points, { padding: [48, 48], maxZoom: 12, duration: 0.8 });
    } else {
      map.fitBounds(points, { padding: [32, 32], maxZoom: 12 });
      hasFitted.current = true;
    }
  }, [map, country, province, district, fitRequest]);

  return null;
}
