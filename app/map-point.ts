export type MapPointType = "CONTROL" | "START";

class MapPoint {
  public readonly id: string;
  public readonly lat: number;
  public readonly lng: number;
  public readonly type: MapPointType = "CONTROL";

  constructor({
    id,
    lat,
    lng,
    type = "CONTROL",
  }: {
    id?: string;
    lat: number;
    lng: number;
    type?: MapPointType;
  }) {
    this.id = id ?? crypto.randomUUID();
    this.lat = lat;
    this.lng = lng;
    this.type = type;

    Object.freeze(this);
  }

  public copy({
    lat = this.lat,
    lng = this.lng,
    type = this.type,
  }: {
    lat?: number;
    lng?: number;
    type?: MapPointType;
  }): MapPoint {
    return new MapPoint({ id: this.id, lat, lng, type: type ?? this.type });
  }
}

export default MapPoint;
