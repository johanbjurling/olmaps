import Course from "./course";
import MapPoint from "./map-point";

class Competition {
  public readonly id: string;
  public readonly mapPoints: readonly MapPoint[];
  public readonly courses: readonly Course[];

  constructor({
    id,
    mapPoints = [],
    courses = [],
  }: {
    id?: string;
    mapPoints?: readonly MapPoint[];
    courses?: readonly Course[];
  }) {
    this.id = id ?? crypto.randomUUID();
    this.mapPoints = Object.freeze([...mapPoints]);
    this.courses = Object.freeze([...courses]);

    Object.freeze(this);
  }

  public copy({
    mapPoints,
    courses,
  }: {
    mapPoints?: readonly MapPoint[];
    courses?: readonly Course[];
  }): Competition {
    return new Competition({
      id: this.id,
      mapPoints: mapPoints ?? this.mapPoints,
      courses: courses ?? this.courses,
    });
  }

  public addMapPoint(mapPoint: MapPoint): Competition {
    return this.copy({ mapPoints: [...this.mapPoints, mapPoint] });
  }

  public updateMapPoint(updatedPoint: MapPoint): Competition {
    const updatedPoints = this.mapPoints.map((point) =>
      point.id === updatedPoint.id ? updatedPoint : point
    );
    return this.copy({ mapPoints: updatedPoints });
  }
}

export default Competition;
