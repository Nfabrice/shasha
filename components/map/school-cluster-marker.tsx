"use client";

import { Marker, useMap } from "react-leaflet";
import { dominantPhase, type SchoolCluster } from "@/lib/clustering";
import { PHASE_COLORS } from "@/lib/constants";
import { getClusterIcon } from "@/lib/leaflet-icons";

interface SchoolClusterMarkerProps {
  cluster: SchoolCluster;
}

export function SchoolClusterMarker({ cluster }: SchoolClusterMarkerProps) {
  const map = useMap();
  const phase = dominantPhase(cluster);
  const color = PHASE_COLORS[phase].markerDark;

  return (
    <Marker
      position={[cluster.latitude, cluster.longitude]}
      icon={getClusterIcon(cluster.schools.length, color)}
      eventHandlers={{
        click: () => {
          const bounds = cluster.schools.map(
            (s) => [s.latitude, s.longitude] as [number, number],
          );
          map.flyToBounds(bounds, { padding: [64, 64], duration: 0.7, maxZoom: 14 });
        },
      }}
    />
  );
}
