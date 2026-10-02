"use client";

import { MapContainer, ScaleControl, TileLayer, ZoomControl } from "react-leaflet";
import { DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM, RWANDA_CENTER } from "@/lib/constants";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { MapAutoResize } from "./map-auto-resize";
import { MapFitBounds } from "./map-fit-bounds";
import { MapFlyToSelection } from "./map-fly-to-selection";
import { MapMarkers } from "./map-markers";

// Esri satellite imagery plus a transparent layer of place names and borders on top.
// Esri requires the "Powered by Esri" credit and the services' source text.
const ESRI_ATTRIBUTION = 'Powered by <a href="https://www.esri.com">Esri</a>';
const SATELLITE_ATTRIBUTION = `${ESRI_ATTRIBUTION} &mdash; Source: Esri, Vantor, Earthstar Geographics, and the GIS User Community`;
const LABELS_ATTRIBUTION = "Labels: Esri, HERE, Garmin, &copy; OpenStreetMap contributors";

export function MapCanvas() {
  const basemap = useDashboardStore((state) => state.basemap);

  return (
    <MapContainer
      center={RWANDA_CENTER}
      zoom={DEFAULT_ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      zoomControl={false}
      scrollWheelZoom
      zoomSnap={1}
      zoomAnimation
      worldCopyJump
      className="h-full w-full"
    >
      {basemap === "satellite" ? (
        <>
          <TileLayer
            key="satellite"
            attribution={SATELLITE_ATTRIBUTION}
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          <TileLayer
            key="satellite-labels"
            attribution={LABELS_ATTRIBUTION}
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          />
        </>
      ) : (
        // Desaturated in globals.css (.shasha-basemap) so the blue/red school markers stand out.
        <TileLayer
          key="map"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="shasha-basemap"
        />
      )}
      <ZoomControl position="topleft" />
      <ScaleControl position="bottomleft" imperial={false} />
      <MapFitBounds />
      <MapFlyToSelection />
      <MapAutoResize />
      <MapMarkers />
    </MapContainer>
  );
}
