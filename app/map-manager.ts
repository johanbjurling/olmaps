import L from "leaflet";
import Competition from "./competition";
import MapPoint from "./map-point";
import UIManager, { UIState } from "./ui-manager";
import CompetitionManager from "./competition-manager";
import { combineLatest, Subscription } from "rxjs";

const RING_RADIUS_METERS = 37.5;
const COURSE_COLOR = "rgb(203, 0, 136)";

function getLineWidth(zoom: number) {
  return zoom * 1.25 + 1;
}

function getPointOnEdge(center: L.LatLng, target: L.LatLng, radius: number) {
  // Calculate angle from center to target
  const angle = Math.atan2(target.lat - center.lat, target.lng - center.lng);

  // Calculate new lat/lng on the edge of the circle
  const newLat = center.lat + Math.sin(angle) * radius;
  const newLng = center.lng + Math.cos(angle) * radius;

  return L.latLng(newLat, newLng);
}

class MapManager {
  private _map: L.Map;
  private _controlPointsLayer: L.LayerGroup;
  private _lineLayer: L.LayerGroup;
  private _activeCircle: L.Circle | null = null;
  private _subscriptions: Subscription[] = [];

  constructor(map: L.Map) {
    this._map = map;
    this._controlPointsLayer = L.layerGroup().addTo(this._map);
    this._lineLayer = L.layerGroup().addTo(this._map);

    this._map.on("zoomend", () => {
      this._onZoomEnd();
    });

    this._map.on("click", (e: L.LeafletMouseEvent) => {
      this._onMapClick(e);
    });

    this._subscriptions.push(
      combineLatest([
        UIManager.instance.uiStateSubject,
        CompetitionManager.instance.subject,
      ]).subscribe(([uiState, competition]) => {
        this._update({ uiState, competition });
      })
    );
  }

  dispose() {
    this._subscriptions.forEach((s) => s.unsubscribe());
  }

  private _onMapClick(e: L.LeafletMouseEvent) {
    switch (UIManager.instance.uiStateSubject.value.inputMode) {
      case "ADD_CONTROL_POINT":
        this._addControlPointAt(e);
        break;
      case "NONE":
        UIManager.instance.setCurrentMapPointId(null);
        break;
      default:
        break;
    }
  }

  private _addControlPointAt(e: L.LeafletMouseEvent) {
    const mapPoint = new MapPoint({
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    });

    CompetitionManager.instance.addControl({
      mapPoint,
    });

    UIManager.instance.setCurrentMapPointId(mapPoint.id);
  }

  private _onZoomEnd() {
    const currentZoom = this._map.getZoom();

    // Update line widths
    this._lineLayer.eachLayer((layer) => {
      const line = layer as L.Polyline;
      line.setStyle({
        weight: getLineWidth(currentZoom),
      });
    });

    // Update control point circle weights
    this._controlPointsLayer.eachLayer((layer) => {
      const circle = layer as L.Circle;
      circle.setStyle({
        weight: getLineWidth(currentZoom),
      });
    });

    this._updateActiveCircle(
      UIManager.instance.uiStateSubject.value.currentMapPointId
    );
  }

  private _updateLines(currentCourseId?: string | null) {
    const controlPoints = this._controlPointsLayer.getLayers() as L.Circle[];
    const lines = this._lineLayer.getLayers() as L.Polyline[];

    // 1.Create desired lines based on current control points
    const desiredLines: {
      id: string;
      start: L.LatLng;
      end: L.LatLng;
    }[] = [];

    if (currentCourseId) {
      for (let i = 0; i < controlPoints.length - 1; i++) {
        const startPoint = controlPoints[i];
        const endPoint = controlPoints[i + 1];

        const startId = startPoint.pointId;
        const endId = endPoint.pointId;

        desiredLines.push({
          id: `${startId}-${endId}`,
          start: startPoint.getLatLng(),
          end: endPoint.getLatLng(),
        });
      }
    }

    // 2. Remove lines that are no longer desired
    lines.forEach((line) => {
      if (!desiredLines.find((dl) => dl.id === line.lineId)) {
        this._lineLayer.removeLayer(line);
      }
    });

    // 3. Update existing lines or create new ones
    desiredLines.forEach((dl) => {
      const existingLine = lines.find((l) => l.lineId === dl.id);

      // Beräkna de exakta punkterna på kanten (samma logik som förut)
      const startPoint = getPointOnEdge(
        dl.start,
        dl.end,
        RING_RADIUS_METERS * 2
      );
      const endPoint = getPointOnEdge(dl.end, dl.start, RING_RADIUS_METERS * 2);
      const newLatLngs = [startPoint, endPoint];

      if (existingLine) {
        // Update position if it has changed
        const currentLatLngs = existingLine.getLatLngs() as L.LatLng[];
        if (
          !currentLatLngs[0].equals(startPoint) ||
          !currentLatLngs[1].equals(endPoint)
        ) {
          existingLine.setLatLngs(newLatLngs);
        }

        existingLine.setStyle({ weight: getLineWidth(this._map.getZoom()) });
      } else {
        // Create new line if it doesn't exist
        const line = L.polyline(newLatLngs, {
          color: COURSE_COLOR,
          weight: getLineWidth(this._map.getZoom()),
        });

        line.lineId = dl.id;
        line.addTo(this._lineLayer);
      }
    });
  }

  private _updateControlPoints(controlPoints: readonly MapPoint[]) {
    const currentControlPoints =
      this._controlPointsLayer.getLayers() as L.Circle[];

    // 1. Remove circles that are no longer in controlPoints
    currentControlPoints.forEach((point: L.Circle) => {
      if (!controlPoints.find((p) => p.id === point.pointId)) {
        this._controlPointsLayer.removeLayer(point);
      }
    });

    // 2. Update or create circles for each controlPoint
    controlPoints.forEach((point: MapPoint) => {
      const existingCircle = currentControlPoints.find((l) => {
        return l.pointId === point.id;
      });

      if (existingCircle) {
        // Update position if it has changed
        const currentPos = existingCircle.getLatLng();
        if (currentPos.lat !== point.lat || currentPos.lng !== point.lng) {
          existingCircle.setLatLng([point.lat, point.lng]);
        }
      } else {
        // Create a new circle if it doesn't exist
        const circle = L.circle([point.lat, point.lng], {
          color: COURSE_COLOR,
          fillColor: COURSE_COLOR,
          fillOpacity: 0,
          radius: RING_RADIUS_METERS,
          weight: getLineWidth(this._map.getZoom()),
          draggable: true,
        });

        circle.pointId = point.id;
        circle.addTo(this._controlPointsLayer);

        circle.on("click", (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          UIManager.instance.setCurrentMapPointId(point.id);
        });

        // Attach events
        circle.on("drag", () => {
          this._updateLines(
            UIManager.instance.uiStateSubject.value.currentCourseId
          );
          UIManager.instance.setCurrentMapPointId(point.id);
          this._updateActiveCircle(point.id);
        });

        circle.on("dragend", (e: L.LeafletEvent) => {
          const target = e.target as L.Circle;
          const newPos = target.getLatLng();

          CompetitionManager.instance.updateMapPoint(
            point.copy({ lat: newPos.lat, lng: newPos.lng })
          );
        });
      }
    });
  }

  private _updateActiveCircle(currentMapPointId: string | null) {
    const points = this._controlPointsLayer.getLayers() as L.Circle[];
    const point = points.find((p) => p.pointId === currentMapPointId);

    if (point) {
      const pos = point.getLatLng();

      const INNER_RADIUS = RING_RADIUS_METERS;
      const OUTER_RADIUS = INNER_RADIUS * 2;
      const HALO_WIDTH_METERS = OUTER_RADIUS - INNER_RADIUS;

      // We place the circle at the midpoint of the halo
      const midRadiusMeters = INNER_RADIUS + HALO_WIDTH_METERS / 2;

      // Calculate the thickness in pixels for the current zoom
      const weightInPixels = this._metersToPixels(HALO_WIDTH_METERS);

      if (!this._activeCircle) {
        this._activeCircle = L.circle(pos, {
          radius: midRadiusMeters,
          color: COURSE_COLOR,
          opacity: 0.3, // Slightly more visible halo
          fill: false, // Important: no fill, just a thick border
          weight: weightInPixels,
          interactive: false,
        }).addTo(this._map);

        this._activeCircle.bringToBack();
      } else {
        this._activeCircle.setLatLng(pos);
        this._activeCircle.setRadius(midRadiusMeters);
        this._activeCircle.setStyle({ weight: weightInPixels });
      }
    } else {
      this._activeCircle?.remove();
      this._activeCircle = null;
    }
  }

  private _metersToPixels(meters: number): number {
    return meters * this._map.options.crs!.scale(this._map.getZoom());
  }

  private _update({
    competition,
    uiState,
  }: {
    competition: Competition;
    uiState: UIState;
  }) {
    this._updateControlPoints(competition.mapPoints);
    this._updateLines(uiState.currentCourseId);
    this._updateActiveCircle(uiState.currentMapPointId);
  }
}

export default MapManager;
