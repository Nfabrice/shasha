"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function MapAutoResize() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize({ animate: true });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}
