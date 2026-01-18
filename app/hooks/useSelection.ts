import { useCallback } from "react";
import SelectionService from "../SelectionService";
import { useBehaviorSubject } from "./useBehaviorSubject";

export const useSelection = () => {
  const selectedId = useBehaviorSubject(SelectionService.instance.selectedId$);

  const setSelectedId = useCallback((id: string | null) => {
    SelectionService.instance.select(id);
  }, []);

  return {
    selectedId,
    setSelectedId,
  };
};
