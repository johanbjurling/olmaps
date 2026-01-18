import { useEffect, useRef, useState } from "react";
import { Circle, Marker } from "react-leaflet";
import L from "leaflet";
import CompetitionManager from "./CompetitionManager";
import {
  COURSE_COLOR,
  LINE_WIDTH_ZOOM_MULTIPLIER,
  RING_RADIUS_METERS,
} from "./constants";
import React from "react";
import PresenceManager from "./PresenceManager";
import { usePresence } from "./hooks/usePresence";

const ControlPoint = ({ point, zoom }: { point: any; zoom: number }) => {
  const circleRef = useRef<L.Circle>(null);
  const presences = usePresence();
  const [isDraggingLocally, setIsDraggingLocally] = useState(false);
  const [currentPos, setCurrentPos] = useState({
    lat: point.lat,
    lng: point.lng,
  });
  const isBeingDraggedByAnyone = presences.some(
    (u) => u.draggingPoint?.id === point.id
  );

  const crossSize = Math.pow(2, zoom - 10) * 1.5;
  const finalSize = Math.max(10, Math.min(crossSize, 150));
  const half = finalSize / 2;

  const crossHairIcon = L.divIcon({
    html: `
      <svg width="${finalSize}" height="${finalSize}" viewBox="0 0 ${finalSize} ${finalSize}" 
           style="margin-left: -${half}px; margin-top: -${half}px; display: block;">
        <line x1="${half}" y1="0" x2="${half}" y2="${finalSize}" stroke="black" stroke-width="2" />
        <line x1="0" y1="${half}" x2="${finalSize}" y2="${half}" stroke="black" stroke-width="2" />
      </svg>`,
    className: "custom-crosshair",
    iconSize: [0, 0],
  });

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    circle.on("click", (e: L.LeafletMouseEvent) => {
      L.DomEvent.stopPropagation(e);
    });

    circle.on("dragstart", () => {
      document.body.classList.add("hide-cursor");
      setIsDraggingLocally(true);
      PresenceManager.instance.updateDraggingPoint({
        id: point.id,
        lat: point.lat,
        lng: point.lng,
      });
    });

    circle.on("drag", () => {
      const pos = circle.getLatLng();
      setCurrentPos({ lat: pos.lat, lng: pos.lng });
      PresenceManager.instance.updateDraggingPoint({
        id: point.id,
        lat: pos.lat,
        lng: pos.lng,
      });
    });

    circle.on("dragend", () => {
      const newPos = circle.getLatLng();
      setIsDraggingLocally(false);
      document.body.classList.remove("hide-cursor");

      // 1. Clear dragging-state
      PresenceManager.instance.updateDraggingPoint(null);

      // 2. Save permanent position
      CompetitionManager.instance.updateMapPointCoordinates({
        pointId: point.id,
        lat: newPos.lat,
        lng: newPos.lng,
      });
    });

    return () => {
      document.body.classList.remove("hide-cursor");
      circle.off("dragstart drag dragend");
    };
  }, [point.id, point.lat, point.lng]);

  return (
    <>
      <Circle
        ref={circleRef}
        center={[point.lat, point.lng]}
        radius={RING_RADIUS_METERS}
        pathOptions={{
          color: COURSE_COLOR,
          weight: zoom * LINE_WIDTH_ZOOM_MULTIPLIER + 1,
          fill: true,
          fillColor: "white",
          fillOpacity: 0,
          opacity: isBeingDraggedByAnyone ? 0 : 1,
        }}
        interactive={true}
        draggable={true}
      />
      {isDraggingLocally && zoom >= 2 && (
        <Marker
          position={[currentPos.lat, currentPos.lng]}
          icon={crossHairIcon}
          interactive={false}
          zIndexOffset={1000}
        />
      )}
    </>
  );
};

export const ControlPointMarker = React.memo(
  ControlPoint,
  (prevProps, nextProps) => {
    return (
      prevProps.point.lat === nextProps.point.lat &&
      prevProps.point.lng === nextProps.point.lng &&
      prevProps.zoom === nextProps.zoom
    );
  }
);
