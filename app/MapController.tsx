import { useMapEvents } from "react-leaflet";
import PresenceManager from "./PresenceManager";

export function MapController() {
  const map = useMapEvents({
    mousemove: (e) => {
      PresenceManager.instance.updateCursor({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
    mouseout: () => {
      PresenceManager.instance.updateCursor(null);
    },
  });

  return null;
}
