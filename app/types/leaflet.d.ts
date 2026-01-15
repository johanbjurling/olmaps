import * as L from "leaflet";

declare module "leaflet" {
  interface CircleOptions {
    pointId?: string;
  }
  interface Circle {
    pointId?: string;
  }
  interface Polygon {
    pointId?: string;
  }
  interface PolylineOptions {
    draggable?: boolean;
  }
  interface CircleMarkerOptions {
    draggable?: boolean;
  }
  interface PolylineOptions {
    lineId?: string;
  }
  interface Polyline {
    lineId?: string;
  }
}
