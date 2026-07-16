"use client";

import { MapContainer, ScaleControl, TileLayer, ZoomControl } from "react-leaflet";
import { DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM, RWANDA_CENTER } from "@/lib/constants";
import { MapAutoResize } from "./map-auto-resize";
import { MapFitBounds } from "./map-fit-bounds";
import { MapFlyToSelection } from "./map-fly-to-selection";
import { MapMarkers } from "./map-markers";

export function MapCanvas() {
  return (
    <MapContainer
      center={RWANDA_CENTER}
      zoom={DEFAULT_ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      zoomControl={false}
      scrollWheelZoom
      zoomSnap={0.25}
      zoomAnimation
      worldCopyJump
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="topleft" />
      <ScaleControl position="bottomleft" imperial={false} />
      <MapFitBounds />
      <MapFlyToSelection />
      <MapAutoResize />
      <MapMarkers />
    </MapContainer>
  );
}
