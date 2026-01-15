import { useCompetition } from "./hooks/useCompetition";
import { ControlPointMarker } from "./ControlPointMarker";

const MapPointsLayer = () => {
  const competition = useCompetition();

  return (
    <>
      {competition.mapPoints.map((point) => (
        <ControlPointMarker key={point.id} point={point} />
      ))}
    </>
  );
};

export default MapPointsLayer;
