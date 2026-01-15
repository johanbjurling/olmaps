import UIManager from "./ui-manager";
import { useBehaviorSubject } from "./useBehaviorSubject";

export const useUIState = () => {
  return useBehaviorSubject(UIManager.instance.uiStateSubject);
};
