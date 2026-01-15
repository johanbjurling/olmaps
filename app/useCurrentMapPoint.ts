import CompetitionManager from "./competition-manager";
import UIManager from "./ui-manager";
import { useBehaviorSubject } from "./useBehaviorSubject";

export const useCurrentMapPoint = () => {
  const uiState = useBehaviorSubject(UIManager.instance.uiStateSubject);
  const competition = useBehaviorSubject(CompetitionManager.instance.subject);

  const currentMapPoint = competition.mapPoints.find(
    (point) => point.id === uiState.currentMapPointId
  );

  return currentMapPoint;
};
