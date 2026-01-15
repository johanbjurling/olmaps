import { useEffect, useRef } from "react";
import { Circle } from "react-leaflet";
import L from "leaflet";
import CompetitionManager from "./CompetitionManager";
import { COURSE_COLOR, RING_RADIUS_METERS } from "./constants";

export const ControlPointMarker = ({ point }: { point: any }) => {
  const circleRef = useRef<L.Circle>(null);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    circle.on("dragend", (e) => {
      const newPos = circle.getLatLng();

      // Uppdatera Yjs via din manager
      CompetitionManager.instance.updateMapPoint({
        ...point,
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
        weight: 3,
        fill: true,
        fillColor: "white",
        fillOpacity: 0,
      }}
      interactive={true}
      draggable={true}
    />
  );
};
