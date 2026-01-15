import PresenceManager from "../PresenceManager";
import { useBehaviorSubject } from "./useBehaviorSubject";

export const usePresence = () => {
  return useBehaviorSubject(PresenceManager.instance.subject);
};
