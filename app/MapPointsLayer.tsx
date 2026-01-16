import { useCompetition } from "./hooks/useCompetition";
import { ControlPointMarker } from "./ControlPointMarker";

const MapPointsLayer = ({ zoom }: { zoom: number }) => {
  const competition = useCompetition();

  return (
    <>
      {competition.mapPoints.map((point) => (
        <ControlPointMarker key={point.id} point={point} zoom={zoom} />
      ))}
    </>
  );
};

export default MapPointsLayer;
