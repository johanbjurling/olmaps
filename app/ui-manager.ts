import { BehaviorSubject } from "rxjs";

type InputMode =
  | "ADD_CONTROL_POINT"
  | "ADD_START_POINT"
  | "ADD_FINISH_POINT"
  | "NONE";

export type UIState = {
  currentMapPointId: string | null;
  currentCourseId: string | null;
  inputMode: InputMode;
};

class UIManager {
  private static _instance: UIManager;
  private _uiStateSubject: BehaviorSubject<UIState>;

  constructor() {
    this._uiStateSubject = new BehaviorSubject<UIState>({
      currentMapPointId: null,
      currentCourseId: null,
      inputMode: "ADD_CONTROL_POINT",
    });
  }

  get uiStateSubject(): BehaviorSubject<UIState> {
    return this._uiStateSubject;
  }

  public static get instance(): UIManager {
    if (!UIManager._instance) {
      UIManager._instance = new UIManager();
    }
    return UIManager._instance;
  }

  setCurrentMapPointId(pointId: string | null) {
    this._uiStateSubject.next({
      ...this._uiStateSubject.value,
      currentMapPointId: pointId,
    });
  }

  setCurrentCourseId(courseId: string | null) {
    this._uiStateSubject.next({
      ...this._uiStateSubject.value,
      currentCourseId: courseId,
    });
  }

  setInputMode(inputMode: InputMode) {
    this._uiStateSubject.next({
      ...this._uiStateSubject.value,
      inputMode: inputMode,
    });
  }
}

export default UIManager;
