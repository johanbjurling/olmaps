class MapPoint {
  public readonly id: string;
  public readonly lat: number;
  public readonly lng: number;

  constructor({ id, lat, lng }: { id?: string; lat: number; lng: number }) {
    this.id = id ?? crypto.randomUUID();
    this.lat = lat;
    this.lng = lng;

    Object.freeze(this);
  }

  public copy({
    lat = this.lat,
    lng = this.lng,
  }: {
    lat?: number;
    lng?: number;
  }): MapPoint {
    return new MapPoint({ id: this.id, lat, lng });
  }
}

export default MapPoint;
