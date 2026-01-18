import { Polygon } from "react-leaflet";
import { useDraggablePoint } from "./hooks/useDraggablePoint";
import {
  COURSE_COLOR,
  LINE_WIDTH_ZOOM_MULTIPLIER,
  RING_RADIUS_METERS,
} from "./constants";
import React from "react";
import MapPoint from "./map-point";
import L from "leaflet";

function getTrianglePoints(mapPoint: MapPoint, sizeMeters: number) {
  const h = sizeMeters * (Math.sqrt(3) / 2);
  const center = L.latLng(mapPoint.lat, mapPoint.lng);

  const p1 = L.latLng(center.lat + h / 2, center.lng);
  const p2 = L.latLng(center.lat - h / 2, center.lng - sizeMeters / 2);
  const p3 = L.latLng(center.lat - h / 2, center.lng + sizeMeters / 2);

  return [p1, p2, p3];
}

const StartPoint = ({ point, zoom }: { point: any; zoom: number }) => {
  const { shapeRef } = useDraggablePoint(point);
  const triangleCoords = getTrianglePoints(point, RING_RADIUS_METERS);

  return (
    <>
      <Polygon
        ref={shapeRef}
        positions={triangleCoords}
        pathOptions={{
          color: COURSE_COLOR,
          weight: zoom * LINE_WIDTH_ZOOM_MULTIPLIER + 1,
          fillColor: "white",
          fillOpacity: 0,
        }}
        interactive={true}
        draggable={true}
      />
    </>
  );
};

export const StartPointMarker = React.memo(
  StartPoint,
  (prevProps, nextProps) => {
    return (
      prevProps.point.lat === nextProps.point.lat &&
      prevProps.point.lng === nextProps.point.lng &&
      prevProps.zoom === nextProps.zoom
    );
  }
);
