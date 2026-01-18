import { useEffect, useRef, useState } from "react";
import PresenceManager from "../PresenceManager";
import CompetitionManager from "../CompetitionManager";
import L from "leaflet";
import { useSelection } from "./useSelection";

export const useDraggablePoint = (point: any) => {
  const { selectedId, setSelectedId } = useSelection();
  const [isDraggingLocally, setIsDraggingLocally] = useState(false);
  const crosshairRef = useRef<L.Marker>(null);
  const shapeRef = useRef<any>(null);

  useEffect(() => {
    const shape = shapeRef.current;
    if (!shape) return;

    const onDragStart = () => {
      document.body.classList.add("hide-cursor");
      setSelectedId(point.id);
      setIsDraggingLocally(true);
      PresenceManager.instance.updateDraggingPoint({
        id: point.id,
        lat: point.lat,
        lng: point.lng,
      });
    };

    const onDrag = () => {
      const pos = shape.getLatLng
        ? shape.getLatLng()
        : shape.getBounds().getCenter();

      if (crosshairRef.current) {
        crosshairRef.current.setLatLng(pos);
      }

      PresenceManager.instance.updateDraggingPoint({
        id: point.id,
        lat: pos.lat,
        lng: pos.lng,
      });
    };

    const onDragEnd = () => {
      const pos = shape.getLatLng
        ? shape.getLatLng()
        : shape.getBounds().getCenter();
      setIsDraggingLocally(false);
      document.body.classList.remove("hide-cursor");
      PresenceManager.instance.updateDraggingPoint(null);
      CompetitionManager.instance.updateMapPointCoordinates({
        pointId: point.id,
        lat: pos.lat,
        lng: pos.lng,
      });
    };

    shape.on("click", (e: L.LeafletMouseEvent) => {
      L.DomEvent.stopPropagation(e);
      setSelectedId(point.id);
    });
    shape.on("dragstart", onDragStart);
    shape.on("drag", onDrag);
    shape.on("dragend", onDragEnd);

    return () => {
      shape.off("click dragstart drag dragend");
      document.body.classList.remove("hide-cursor");
    };
  }, [point.id, point.lat, point.lng]);

  return {
    shapeRef,
    isDraggingLocally,
    crosshairRef,
    isSelected: selectedId === point.id,
  };
};
