"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-path-drag";
import L, { point } from "leaflet";
import { useEffect, useRef } from "react";
import CompetitionManager from "./competition-manager";
import MapPoint from "./map-point";
import MapManager, { MapPointUpdateEvent } from "./map-manager";

export default function MapLayer() {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const extent = [
      662158.0538812189, 6567716.593172748, 667687.8833337717,
      6571161.757664087,
    ];
    const minZoom = 0;
    const maxZoom = 3;
    const maxResolution = 1;
    const minResolution = Math.pow(2, maxZoom) * maxResolution;
    const crs = L.CRS.Simple;
    crs.transformation = new L.Transformation(1, 0, -1, 0);
    crs.projection.bounds = L.bounds([0, 0], [extent[2], extent[3]]);

    crs.scale = function (zoom) {
      return Math.pow(2, zoom) / minResolution;
    };
    crs.zoom = function (scale) {
      return Math.log(scale * minResolution) / Math.LN2;
    };
    crs.infinite = false;

    const map = L.map(ref.current, {
      crs: crs,
      minZoom: 0,
      maxZoom: 3,
    });

    mapRef.current = map;

    const tiles = L.tileLayer("tiles/{z}/{x}/{y}.png", {
      tms: true,
      bounds: [
        [extent[1], extent[0]],
        [extent[3], extent[2]],
      ],
    }).addTo(map);

    const mapBounds = L.latLngBounds(
      [extent[1], extent[0]],
      [extent[3], extent[2]]
    );

    map.fitBounds(mapBounds);

    const mapManager = new MapManager(map);

    const subMapEvents = mapManager.mapEventSubject.subscribe((mapEvent) => {
      switch (mapEvent.type) {
        case "map-point-updated":
          CompetitionManager.instance.mapPointUpdated(mapEvent.point);
          break;
      }
    });

    const sub = CompetitionManager.instance.subject.subscribe((competition) => {
      mapManager.update(competition);
    });

    return () => {
      subMapEvents.unsubscribe();
      sub.unsubscribe();
      map.remove();
    };
  }, []);

  return <div className="absolute w-full h-full" ref={ref}></div>;
}
