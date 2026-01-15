import CompetitionManager from "./competition-manager";
import UIManager from "./ui-manager";
import { useCurrentMapPoint } from "./useCurrentMapPoint";

export function CurrentMapPointDetails() {
  const currentMapPoint = useCurrentMapPoint();

  if (!currentMapPoint) {
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Map Point Details</h2>
      <p>
        <strong>ID:</strong> {currentMapPoint.id}
      </p>
      <p>
        <strong>Type:</strong> {currentMapPoint.type}
      </p>
      <button
        className="mt-4 p-2 bg-red-500 text-white rounded"
        onClick={() => {
          if (!currentMapPoint.id) return;

          CompetitionManager.instance.deleteMapPoint(currentMapPoint.id);
          UIManager.instance.setCurrentMapPointId(null);
        }}
      >
        Delete
      </button>
      <p>
        <strong>Latitude:</strong> {currentMapPoint.lat.toFixed(6)}
      </p>
      <p>
        <strong>Longitude:</strong> {currentMapPoint.lng.toFixed(6)}
      </p>
    </div>
  );
}
