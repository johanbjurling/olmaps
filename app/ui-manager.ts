import { BehaviorSubject } from "rxjs";

type InputMode =
  | "ADD_CONTROL_POINT"
  | "ADD_START_POINT"
  | "ADD_FINISH_POINT"
  | "NONE";

class UIManager {
  private static _instance: UIManager;
  private _currentMapPointIdSubject: BehaviorSubject<string | null>;
  private _currentCourseIdSubject: BehaviorSubject<string | null>;
  private _inputModeSubject: BehaviorSubject<InputMode>;

  constructor() {
    this._currentMapPointIdSubject = new BehaviorSubject<string | null>(null);
    this._currentCourseIdSubject = new BehaviorSubject<string | null>(null);
    this._inputModeSubject = new BehaviorSubject<InputMode>(
      "ADD_CONTROL_POINT"
    );
  }

  get currentMapPointIdSubject(): BehaviorSubject<string | null> {
    return this._currentMapPointIdSubject;
  }

  get currentCourseIdSubject(): BehaviorSubject<string | null> {
    return this._currentCourseIdSubject;
  }

  get inputModeSubject(): BehaviorSubject<InputMode> {
    return this._inputModeSubject;
  }

  public static get instance(): UIManager {
    if (!UIManager._instance) {
      UIManager._instance = new UIManager();
    }
    return UIManager._instance;
  }

  setCurrentMapPointId(pointId: string | null) {
    this._currentMapPointIdSubject.next(pointId);
  }

  setCurrentCourseId(courseId: string | null) {
    this._currentCourseIdSubject.next(courseId);
  }

  setInputMode(inputMode: InputMode) {
    this._inputModeSubject.next(inputMode);
  }
}

export default UIManager;
