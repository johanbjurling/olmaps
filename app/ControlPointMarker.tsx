import { Circle, Marker } from "react-leaflet";
import {
  COURSE_COLOR,
  LINE_WIDTH_ZOOM_MULTIPLIER,
  RING_RADIUS_METERS,
} from "./constants";
import React from "react";
import { CrossHairIcon } from "./CrossHairIcon";
import { useDraggablePoint } from "./hooks/useDraggablePoint";

const ControlPoint = ({ point, zoom }: { point: any; zoom: number }) => {
  const { shapeRef, isDraggingLocally, crosshairRef, isSelected } =
    useDraggablePoint(point);

  return (
    <>
      <Circle
        ref={shapeRef}
        center={[point.lat, point.lng]}
        radius={RING_RADIUS_METERS}
        pathOptions={{
          color: COURSE_COLOR,
          weight: zoom * LINE_WIDTH_ZOOM_MULTIPLIER + 1,
          fill: true,
          fillColor: "white",
          fillOpacity: isSelected ? 0.3 : 0,
        }}
        interactive={true}
        draggable={true}
      />
      {isDraggingLocally && zoom >= 2 && (
        <Marker
          ref={crosshairRef}
          position={[point.lat, point.lng]}
          icon={CrossHairIcon(zoom)}
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
