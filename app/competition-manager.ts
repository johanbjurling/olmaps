import { BehaviorSubject } from "rxjs";
import { Competition } from "./competition";
import MapPoint from "./map-point";

class CompetitionManager {
  private static _instance: CompetitionManager;
  private _subject: BehaviorSubject<Competition>;

  constructor() {
    this._subject = new BehaviorSubject<Competition>({ points: [] });
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

  addControl({ mapPoint }: { mapPoint: MapPoint }) {
    this._subject.next({
      points: [...this._subject.value.points, mapPoint],
    });
  }

  mapPointUpdated(point: MapPoint) {
    const points = this._subject.value.points.map((p) => {
      if (p.id === point.id) {
        return point;
      }
      return p;
    });
    this._subject.next({ points });
  }
}

export default CompetitionManager;
