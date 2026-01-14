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

    map.on("click", function (e: L.LeafletMouseEvent) {
      CompetitionManager.instance.addControl({
        mapPoint: new MapPoint(e.latlng),
      });
    });

    /*const circleGroup = L.layerGroup().addTo(map);

    const lineGroup = L.layerGroup().addTo(map);

    const updateLines = () => {
      lineGroup.clearLayers();

      const circles = circleGroup.getLayers() as L.Circle[];

      for (let i = 0; i < circles.length - 1; i++) {
        const startCenter = circles[i].getLatLng();
        const endCenter = circles[i + 1].getLatLng();
        const radius = circles[i].getRadius();

        const startPoint = getPointOnEdge(startCenter, endCenter, radius + 25);

        const endPoint = getPointOnEdge(endCenter, startCenter, radius + 25);

        L.polyline([startPoint, endPoint], {
          color: COURSE_COLOR,
          weight: getLineWidth(map.getZoom()),
        }).addTo(lineGroup);
      }
    };

    map.on("click", (e) => {
      // e.latlng innehåller koordinaterna där du klickade
      const { lat, lng } = e.latlng;

      // Skapa den nya cirkeln
      const circle = L.circle([lat, lng], {
        color: COURSE_COLOR, // En fin grön färg (Tailwind green-500)
        fillColor: COURSE_COLOR,
        fillOpacity: 0,
        radius: RING_RADIUS_METERS, // Justera radien efter din kartas skala
        weight: getLineWidth(map.getZoom()),
        draggable: true,
      }).addTo(circleGroup);

      circle.on("drag", () => {
        updateLines();
      });

      updateLines();
    });

    map.on("zoomend", () => {
      const currentZoom = map.getZoom();

      circleGroup.eachLayer((layer) => {
        // Eftersom vi bara har cirklar i denna grupp behöver vi inte kolla "instanceof"
        const circle = layer as L.Circle;
        circle.setStyle({
          weight: getLineWidth(currentZoom),
        });
      });

      updateLines();
    });*/

    const mapManager = new MapManager(map);

    const subMapEvents = mapManager.mapEventSubject.subscribe((mapEvent) => {
      switch (mapEvent.type) {
        case "map-point-updated":
          console.log("map-point-updated received in MapLayer");
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
