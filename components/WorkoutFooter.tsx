import { EXERCISES } from "@/data/exercises";
import { WorkoutExercise } from "@/types/Workout";
import { estimateWorkoutDuration } from "@/utils/estimateExerciseDuration";
import { getWorkoutETL } from "@/utils/getWorkoutEtl";
import { ETLDisplay } from "./EtlDisplay";

export const WorkoutFooter = ({
  workout,
  onSave,
}: {
  workout: WorkoutExercise[];
  onSave: () => void;
}) => {
  const totalReps = workout.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.reps, 0),
    0
  );

  const estTime = Math.ceil(estimateWorkoutDuration(workout) / 60);

  const { totalETL, normalizedETL } = getWorkoutETL(
    workout,
    EXERCISES,
    "hypertrophy"
  );

  return (
    <footer className="sticky bottom-0 z-30 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
      <div className="text-sm text-gray-600 flex items-center gap-6">
        <ETLDisplay etl={normalizedETL} label="Total ETL" className="text-sm" />

        <span>
          Total Reps:{" "}
          <span className="font-semibold text-gray-900">{totalReps}</span>
        </span>
        <span>
          Est. Time:{" "}
          <span className="font-semibold text-gray-900">{estTime} min</span>
        </span>
      </div>
    </footer>
  );
};
