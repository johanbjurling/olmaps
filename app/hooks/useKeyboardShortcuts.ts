import { useEffect } from "react";
import CompetitionManager from "../CompetitionManager";
import SelectionService from "../SelectionService";

export const useKeyboardShortcuts = (selectedPointId: string | null) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Ignore if the user is typing into an input field
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const isMod = e.ctrlKey || e.metaKey; // Support for both Windows (Ctrl) and Mac (Cmd)

      // UNDO: Ctrl/Cmd + Z
      if (isMod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        CompetitionManager.instance.undo();
      }

      // REDO: Ctrl/Cmd + Shift + Z eller Ctrl/Cmd + Y
      if (
        (isMod && e.shiftKey && e.key.toLowerCase() === "z") ||
        (isMod && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault();
        CompetitionManager.instance.redo();
      }

      // DELETE: Delete or Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        const idToDelete = SelectionService.instance.currentId;
        if (idToDelete) {
          CompetitionManager.instance.deleteMapPoint(idToDelete);
          SelectionService.instance.select(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPointId]); // Important: Update listener when the selected point changes
};
