import { useEffect, useRef } from "react";
import { Circle } from "react-leaflet";
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
  const isBeingDragged = presences.some(
    (u) => u.draggingPoint?.id === point.id
  );

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    circle.on("dragstart", () => {
      PresenceManager.instance.updateDraggingPoint({
        id: point.id,
        lat: point.lat,
        lng: point.lng,
      });
    });

    circle.on("drag", () => {
      const pos = circle.getLatLng();
      PresenceManager.instance.updateDraggingPoint({
        id: point.id,
        lat: pos.lat,
        lng: pos.lng,
      });
    });

    circle.on("dragend", () => {
      const newPos = circle.getLatLng();

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
      circle.off("dragstart drag dragend");
    };
  }, [point.id, point.lat, point.lng]);

  return (
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
        opacity: isBeingDragged ? 0 : 1,
      }}
      interactive={true}
      draggable={true}
    />
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
