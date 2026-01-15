import UIManager from "./ui-manager";
import { useBehaviorSubject } from "./useBehaviorSubject";

export const InputModeSelector = () => {
  const uiState = useBehaviorSubject(UIManager.instance.uiStateSubject);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Input Mode Selector</h2>
      <button
        className={`block w-full mb-2 p-2 rounded ${
          uiState.inputMode === "ADD_CONTROL_POINT"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
        onClick={() => UIManager.instance.setInputMode("ADD_CONTROL_POINT")}
      >
        Add Control Point
      </button>
      <button
        className={`block w-full mb-2 p-2 rounded ${
          uiState.inputMode === "ADD_START_POINT"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
        onClick={() => UIManager.instance.setInputMode("ADD_START_POINT")}
      >
        Add Start Point
      </button>
      <button
        className={`block w-full mb-2 p-2 rounded ${
          uiState.inputMode === "ADD_FINISH_POINT"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
        onClick={() => UIManager.instance.setInputMode("ADD_FINISH_POINT")}
      >
        Add Finish Point
      </button>
      <button
        className={`block w-full p-2 rounded ${
          uiState.inputMode === "NONE"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
        onClick={() => UIManager.instance.setInputMode("NONE")}
      >
        None
      </button>
    </div>
  );
};
