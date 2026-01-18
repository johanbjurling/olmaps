import { ControlPointMarker } from "./ControlPointMarker";
import { useCompetition } from "./hooks/useCompetition";
import { StartPointMarker } from "./StartPointMarker";

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
