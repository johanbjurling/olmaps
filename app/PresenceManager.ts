import { BehaviorSubject } from "rxjs";
import { WebrtcProvider } from "y-webrtc";
import { type Awareness } from "y-protocols/awareness";
import WebRTCManager from "./WebRTCManager";

export interface UserPresence {
  clientId: number;
  name: string;
  color: string;
  cursor?: { lat: number; lng: number };
  selectedPointId?: string | null;
  draggingPoint?: { id: string; lat: number; lng: number } | null;
}

class PresenceManager {
  private static _instance: PresenceManager;
  private _awareness: Awareness;
  private _subject = new BehaviorSubject<UserPresence[]>([]);

  private constructor(provider: WebrtcProvider) {
    this._awareness = provider.awareness;

    this._awareness.setLocalStateField("user", {
      name: `Användare ${Math.floor(Math.random() * 1000)}`,
      color: this._generateRandomColor(),
    });

    // Lyssna på ändringar från andra
    this._awareness.on("change", () => {
      this._updateSubject();
    });
  }

  private _updateSubject() {
    // 1. Hämta alla entries som en array.
    // Vi castar till 'unknown' först och sedan till den tuple vi vill ha för att komma runt krocken.
    const allStates = Array.from(this._awareness.getStates().entries()) as [
      number,
      any
    ][];

    const states: UserPresence[] = allStates
      .filter(([clientId, state]) => {
        // Validera att 'user' faktiskt finns i objektet (Runtime check)
        // Och filtrera bort oss själva
        return state && state.user && clientId !== this._awareness.clientID;
      })
      .map(([clientId, state]) => {
        // Här vet vi att state.user finns tack vare filter ovan
        return {
          clientId,
          name: state.user.name,
          color: state.user.color,
          cursor: state.cursor,
          selectedPointId: state.selectedPointId,
          draggingPoint: state.draggingPoint,
        };
      });

    this._subject.next(states);
  }
  public updateCursor(pos: { lat: number; lng: number } | null) {
    this._awareness.setLocalStateField("cursor", pos);
  }

  public updateSelection(pointId: string | null) {
    this._awareness.setLocalStateField("selectedPointId", pointId);
  }

  public updateDraggingPoint(
    data: { id: string; lat: number; lng: number } | null
  ) {
    this._awareness.setLocalStateField("draggingPoint", data);
  }

  public get subject() {
    return this._subject;
  }

  private _generateRandomColor() {
    const colors = ["#ff4444", "#44ff44", "#4444ff", "#ffbb00", "#ff00ff"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  public static get instance() {
    if (!PresenceManager._instance) {
      PresenceManager._instance = new PresenceManager(
        WebRTCManager.instance.provider
      );
    }
    return PresenceManager._instance;
  }
}

export default PresenceManager;
