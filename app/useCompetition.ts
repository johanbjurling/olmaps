import CompetitionManager from "./competition-manager";
import { useBehaviorSubject } from "./useBehaviorSubject";

export const useCompetition = () => {
  return useBehaviorSubject(CompetitionManager.instance.subject);
};
