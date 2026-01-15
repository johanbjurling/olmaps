import { BehaviorSubject } from "rxjs";
import MapPoint from "./map-point";
import Competition from "./competition";
import Course from "./course";

class CompetitionManager {
  private static _instance: CompetitionManager;
  private _subject: BehaviorSubject<Competition>;

  constructor() {
    this._subject = new BehaviorSubject<Competition>(new Competition({}));
  }

  public static get instance(): CompetitionManager {
    if (!CompetitionManager._instance) {
      CompetitionManager._instance = new CompetitionManager();
    }
    return CompetitionManager._instance;
  }

  get subject(): BehaviorSubject<Competition> {
    return this._subject;
  }

  newCourse() {
    this._subject.next(this._subject.value.newCourse());
  }

  addMapPoint({ mapPoint }: { mapPoint: MapPoint }) {
    this._subject.next(this._subject.value.addMapPoint(mapPoint));
  }

  updateMapPoint(point: MapPoint) {
    this._subject.next(this._subject.value.updateMapPoint(point));
  }

  deleteMapPoint(pointId: string) {
    const updatedPoints = this._subject.value.mapPoints.filter(
      (point) => point.id !== pointId
    );
    this._subject.next(this._subject.value.copy({ mapPoints: updatedPoints }));
  }
}

export default CompetitionManager;
