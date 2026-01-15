import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

class WebRTCManager {
  private _doc: Y.Doc;
  private _provider: WebrtcProvider;
  private static _instance: WebRTCManager;

  private constructor() {
    this._doc = new Y.Doc();
    this._provider = new WebrtcProvider(
      "competition-room-unique-id-2",
      this._doc
    );
  }

  get doc(): Y.Doc {
    return this._doc;
  }

  get provider(): WebrtcProvider {
    return this._provider;
  }

  public static get instance(): WebRTCManager {
    if (!WebRTCManager._instance) {
      WebRTCManager._instance = new WebRTCManager();
    }
    return WebRTCManager._instance;
  }
}

export default WebRTCManager;
