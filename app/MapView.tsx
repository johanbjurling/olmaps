"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-path-drag";

import { MapContainer, TileLayer } from "react-leaflet";
import RemotePresenceLayer from "./RemotePresenceLayer";
import { MapController } from "./MapController";
import { useMapConfig } from "./hooks/useMapConfig";
import MapPointsLayer from "./MapPointsLayer";

export function MapView() {
  const { crs, mapBounds, minZoom, maxZoom } = useMapConfig();

  return (
    <MapContainer
      crs={crs}
      bounds={mapBounds}
      minZoom={minZoom}
      maxZoom={maxZoom}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="tiles/{z}/{x}/{y}.png" tms={true} bounds={mapBounds} />
      <MapController />
      <MapPointsLayer />
      <RemotePresenceLayer />
    </MapContainer>
  );
}
