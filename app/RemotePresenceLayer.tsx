import React from "react";
import { CircleMarker, Tooltip, Circle } from "react-leaflet";
import { usePresence } from "./hooks/usePresence";
import { useCompetition } from "./hooks/useCompetition";
import {
  COURSE_COLOR,
  LINE_WIDTH_ZOOM_MULTIPLIER,
  RING_RADIUS_METERS,
} from "./constants";

const RemotePresenceLayer = ({ zoom }: { zoom: number }) => {
  const presences = usePresence();
  const competition = useCompetition();

  return (
    <>
      {presences.map((user) => (
        <React.Fragment key={user.clientId}>
          {/* Draw mouse cursor */}
          {user.cursor && (
            <CircleMarker
              center={[user.cursor.lat, user.cursor.lng]}
              radius={4}
              pathOptions={{
                fillColor: user.color,
                color: "white",
                weight: 1,
                fillOpacity: 0.9,
              }}
              interactive={false}
            >
              <Tooltip
                permanent
                direction="right"
                offset={[5, 0]}
                opacity={0.8}
              >
                <span style={{ color: user.color, fontWeight: "bold" }}>
                  {user.name}
                </span>
              </Tooltip>
            </CircleMarker>
          )}

          {user.draggingPoint && (
            <Circle
              center={[user.draggingPoint.lat, user.draggingPoint.lng]}
              radius={RING_RADIUS_METERS}
              pathOptions={{
                color: COURSE_COLOR,
                weight: zoom * LINE_WIDTH_ZOOM_MULTIPLIER + 1,
                fill: true,
                fillColor: user.color,
                fillOpacity: 0,
              }}
              interactive={false}
            />
          )}

          {/* Draw selected point (highlight) */}
          {user.selectedPointId &&
            (() => {
              const point = competition.mapPoints.find(
                (p) => p.id === user.selectedPointId
              );
              if (!point) return null;

              return (
                <Circle
                  center={[point.lat, point.lng]}
                  radius={45}
                  pathOptions={{
                    color: user.color,
                    dashArray: "5, 10",
                    weight: 2,
                    fill: false,
                  }}
                  interactive={false}
                />
              );
            })()}
        </React.Fragment>
      ))}
    </>
  );
};

export default RemotePresenceLayer;
