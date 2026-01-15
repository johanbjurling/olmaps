import CompetitionManager from "./competition-manager";
import UIManager from "./ui-manager";
import { useCompetition } from "./useCompetition";
import { useUIState } from "./useUIState";

export function CourseEditor() {
  const competition = useCompetition();
  const uiState = useUIState();

  return (
    <div>
      <ul>
        {competition.courses.map((course) => (
          <li
            key={course.id}
            onClick={() => {
              if (uiState.currentCourseId === course.id) {
                UIManager.instance.setCurrentCourseId(null);
              } else {
                UIManager.instance.setCurrentCourseId(course.id);
              }
            }}
            className={`p-2 cursor-pointer ${
              uiState.currentCourseId === course.id ? "bg-gray-300" : ""
            }`}
          >
            {course.id}
          </li>
        ))}
      </ul>
      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={() => CompetitionManager.instance.newCourse()}
      >
        Add Course
      </button>
    </div>
  );
}
