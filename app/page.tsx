"use client";

import { CurrentMapPointDetails } from "./current-map-point-details";
import { InputModeSelector } from "./input-mode-selector";
import MapLayer from "./map-layer";

export default function Home() {
  return (
    <div>
      <div id="left-pane" className="absolute w-[20%] h-full">
        <InputModeSelector />
      </div>
      <div id="map-pane" className="absolute left-[20%] w-[60%] h-full">
        <MapLayer />
      </div>
      <div id="right-pane" className="absolute right-0 w-[20%] h-full">
        <CurrentMapPointDetails />
      </div>
    </div>
  );
}
