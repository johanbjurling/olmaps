import { useMapEvents } from "react-leaflet";
import PresenceManager from "./PresenceManager";
import CompetitionManager from "./CompetitionManager";
import MapPoint from "./map-point";

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
    click: (e: L.LeafletMouseEvent) => {
      const mapPoint = new MapPoint({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        type: "CONTROL",
      });
      CompetitionManager.instance.addMapPoint({ mapPoint });
    },
  });

  return null;
}
