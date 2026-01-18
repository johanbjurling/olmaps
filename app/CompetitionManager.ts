import * as Y from "yjs";
import { BehaviorSubject } from "rxjs";
import MapPoint from "./map-point";
import Competition from "./competition";
import Course from "./course";
import { IndexeddbPersistence } from "y-indexeddb";
import WebRTCManager from "./WebRTCManager";
import PresenceManager from "./PresenceManager";

class CompetitionManager {
  private _doc: Y.Doc = WebRTCManager.instance.doc;
  private _yMapPoints: Y.Array<any>;
  private _yCourses: Y.Array<any>;
  private _undoManager: Y.UndoManager;
  private static _instance: CompetitionManager;
  private _subject: BehaviorSubject<Competition>;

  constructor() {
    this._yMapPoints = this._doc.getArray("mapPoints");
    this._yCourses = this._doc.getArray("courses");

    this._subject = new BehaviorSubject<Competition>(new Competition({}));

    this._doc.on("update", () => {
      this._syncYjsToRxJS();
    });

    this._undoManager = new Y.UndoManager([this._yMapPoints, this._yCourses]);
    new IndexeddbPersistence("competition-name", this._doc);
  }

  public destroy() {
    this._doc.destroy();
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
    const yPoint = new Y.Map();

    // We populate the Y.Map with the properties of MapPoint
    yPoint.set("id", mapPoint.id);
    yPoint.set("lat", mapPoint.lat);
    yPoint.set("lng", mapPoint.lng);
    yPoint.set("type", mapPoint.type);

    this._yMapPoints.push([yPoint]);
  }

  updateMapPointCoordinates({
    pointId,
    lat,
    lng,
  }: {
    pointId: string;
    lat: number;
    lng: number;
  }) {
    const yPoint = this._yMapPoints
      .toArray()
      .find((p) => p.get("id") === pointId);

    if (yPoint) {
      this._doc.transact(() => {
        if (yPoint.get("lat") !== lat) yPoint.set("lat", lat);
        if (yPoint.get("lng") !== lng) yPoint.set("lng", lng);
      });
    }
  }

  public deleteMapPoint(id: string) {
    const index = this._yMapPoints
      .toArray()
      .findIndex((p) => p.get("id") === id);

    if (index !== -1) {
      this._yMapPoints.delete(index);
      PresenceManager.instance.updateSelection(null);
    }
  }

  undo() {
    this._undoManager.undo();
  }

  redo() {
    this._undoManager.redo();
  }

  private _syncYjsToRxJS() {
    const mapPoints = this._yMapPoints.toArray().map((yPoint) => {
      const rawData = yPoint.toJSON();
      return new MapPoint(rawData);
    });

    const courses = this._yCourses.toArray().map((yCourse) => {
      return new Course(yCourse.toJSON());
    });

    const updatedCompetition = new Competition({
      mapPoints,
      courses,
    });

    this._subject.next(updatedCompetition);
  }
}

export default CompetitionManager;
