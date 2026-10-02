"use client";

import { Marker, Tooltip, useMap } from "react-leaflet";
import type { SchoolCluster } from "@/lib/clustering";
import { getClusterIcon } from "@/lib/leaflet-icons";
import { isConnected } from "@/services/schools-service";

interface SchoolClusterMarkerProps {
  cluster: SchoolCluster;
}

export function SchoolClusterMarker({ cluster }: SchoolClusterMarkerProps) {
  const map = useMap();
  const connectedCount = cluster.schools.filter(isConnected).length;
  const notConnectedCount = cluster.schools.length - connectedCount;

  return (
    <Marker
      position={[cluster.latitude, cluster.longitude]}
      icon={getClusterIcon(cluster.schools.length, connectedCount)}
      eventHandlers={{
        click: () => {
          const bounds = cluster.schools.map(
            (s) => [s.latitude, s.longitude] as [number, number],
          );
          map.flyToBounds(bounds, { padding: [64, 64], duration: 0.7, maxZoom: 14 });
        },
      }}
    >
      <Tooltip direction="top" opacity={1} offset={[0, -18]} className="shasha-tooltip">
        <div className="flex flex-col gap-1 text-[11px] font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-connected" />
            {connectedCount} connected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-not-connected" />
            {notConnectedCount} not connected
          </span>
        </div>
      </Tooltip>
    </Marker>
  );
}
