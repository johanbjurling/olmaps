import CompetitionManager from "../CompetitionManager";
import { useBehaviorSubject } from "./useBehaviorSubject";

export const useCompetition = () => {
  return useBehaviorSubject(CompetitionManager.instance.subject);
};
