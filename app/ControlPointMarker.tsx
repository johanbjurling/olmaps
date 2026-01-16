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

const ControlPoint = ({ point, zoom }: { point: any; zoom: number }) => {
  const circleRef = useRef<L.Circle>(null);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    circle.on("dragend", () => {
      const newPos = circle.getLatLng();

      // Uppdatera Yjs via din manager
      CompetitionManager.instance.updateMapPointCoordinates({
        pointId: point.id,
        lat: newPos.lat,
        lng: newPos.lng,
      });
    });

    return () => {
      circle.off("dragend");
    };
  }, [point]);

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
