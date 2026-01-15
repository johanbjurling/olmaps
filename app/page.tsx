"use client";

import { InputModeSelector } from "./input-mode-selector";
import MapLayer from "./map-layer";
import UIManager from "./ui-manager";
import { useBehaviorSubject } from "./useBehaviorSubject";

export default function Home() {
  const currentMapPointId = useBehaviorSubject(
    UIManager.instance.currentMapPointIdSubject
  );

  return (
    <div>
      <div id="left-pane" className="absolute w-[20%] h-full">
        <InputModeSelector />
      </div>
      <div id="map-pane" className="absolute left-[20%] w-[60%] h-full">
        <MapLayer />
      </div>
      <div id="right-pane" className="absolute right-0 w-[20%] h-full">
        {currentMapPointId ? (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Map Point Details</h2>
            <p>
              <strong>ID:</strong> {currentMapPointId}
            </p>
            {/*/<p>
              <strong>Latitude:</strong> {currentMapPoint.lat.toFixed(6)}
            </p>
            <p>
              <strong>Longitude:</strong> {currentMapPoint.lng.toFixed(6)}
            </p>*/}
          </div>
        ) : (
          <div className="p-4">No map point selected</div>
        )}
      </div>
    </div>
  );
}
