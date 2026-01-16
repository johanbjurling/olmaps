"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-path-drag";

import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import RemotePresenceLayer from "./RemotePresenceLayer";
import { useMapConfig } from "./hooks/useMapConfig";
import MapPointsLayer from "./MapPointsLayer";
import { useState } from "react";
import CompetitionManager from "./CompetitionManager";
import MapPoint from "./map-point";
import PresenceManager from "./PresenceManager";

function MapViewContent({
  minZoom,
  mapBounds,
}: {
  minZoom: number;
  mapBounds: L.LatLngBoundsExpression;
}) {
  const [zoom, setZoom] = useState(minZoom);

  const map = useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom());
    },
    mousemove: (e) => {
      PresenceManager.instance.updateCursor({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
    mouseout: () => {
      PresenceManager.instance.updateCursor(null);
    },
    click: (e: L.LeafletMouseEvent) => {
      const mapPoint = new MapPoint({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        type: "CONTROL",
      });
      CompetitionManager.instance.addMapPoint({ mapPoint });
    },
  });

  return (
    <>
      <TileLayer url="tiles/{z}/{x}/{y}.png" tms={true} bounds={mapBounds} />
      <MapPointsLayer zoom={zoom} />
      <RemotePresenceLayer />
    </>
  );
}

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
      <MapViewContent minZoom={minZoom} mapBounds={mapBounds} />
    </MapContainer>
  );
}
