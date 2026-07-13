"use client";

import { useMemo, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { useFilteredSchools } from "@/hooks/use-filtered-schools";
import { clusterSchools } from "@/lib/clustering";
import { SchoolMarker } from "./school-marker";
import { SchoolClusterMarker } from "./school-cluster-marker";

export function MapMarkers() {
  const schools = useFilteredSchools();
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  const clusters = useMemo(() => clusterSchools(schools, zoom), [schools, zoom]);

  return (
    <>
      {clusters.map((cluster) =>
        cluster.schools.length > 1 ? (
          <SchoolClusterMarker key={cluster.id} cluster={cluster} />
        ) : (
          <SchoolMarker key={cluster.id} school={cluster.schools[0]} />
        ),
      )}
    </>
  );
}
