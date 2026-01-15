"use client";

import { useEffect, useState } from "react";
import Course from "./course";
import { CourseEditor } from "./course-editor";
import { CurrentMapPointDetails } from "./current-map-point-details";
import { InputModeSelector } from "./input-mode-selector";
import MapLayer from "./map-layer";
import { MapView } from "./MapView";
import CompetitionManager from "./CompetitionManager";
import PresenceManager from "./PresenceManager";
import WebRTCManager from "./WebRTCManager";

export default function Home() {
  /*return (
    <div>
      <div id="left-pane" className="absolute w-[20%] h-full">
        <InputModeSelector />
      </div>
      <div id="map-pane" className="absolute left-[20%] w-[60%] h-full">
        <MapLayer />
      </div>
      <div id="right-pane" className="absolute right-0 w-[20%] h-full">
        <CurrentMapPointDetails />
        <CourseEditor />
      </div>
    </div>
  );*/
  return <MapView />;
}
