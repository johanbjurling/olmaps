import { BehaviorSubject } from "rxjs";
import PresenceManager from "./PresenceManager";

class SelectionService {
  private static _instance: SelectionService;
  private _selectedId$ = new BehaviorSubject<string | null>(null);

  public static get instance() {
    if (!SelectionService._instance) {
      SelectionService._instance = new SelectionService();
    }
    return SelectionService._instance;
  }

  get selectedId$() {
    return this._selectedId$;
  }

  select(id: string | null) {
    this._selectedId$.next(id);
    PresenceManager.instance.updateSelection(id);
  }

  get currentId() {
    return this._selectedId$.getValue();
  }
}

export default SelectionService;
