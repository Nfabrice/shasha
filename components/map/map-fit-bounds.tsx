"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { RWANDA_BOUNDS } from "@/lib/constants";

export function MapFitBounds() {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(RWANDA_BOUNDS, { padding: [28, 28] });
  }, [map]);

  return null;
}
