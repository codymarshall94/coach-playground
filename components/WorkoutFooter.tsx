import { Button } from "@/components/ui/button";
import { WorkoutExercise } from "@/types/Workout";
import { estimateWorkoutDuration } from "@/utils/estimateExerciseDuration";

export const WorkoutFooter = ({
  workout,
  onSave,
}: {
  workout: WorkoutExercise[];
  onSave: () => void;
}) => {
  const totalVolume = workout.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
    0
  );

  const totalReps = workout.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.reps, 0),
    0
  );

  const estTime = Math.ceil(estimateWorkoutDuration(workout) / 60);

  return (
    <footer className="sticky bottom-0 z-30 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
      <div className="text-sm text-gray-600 flex items-center gap-6">
        <span>
          Total Volume:{" "}
          <span className="font-semibold text-gray-900">
            {totalVolume.toFixed(1)} kg
          </span>
        </span>
        <span>
          Total Reps:{" "}
          <span className="font-semibold text-gray-900">{totalReps}</span>
        </span>
        <span>
          Est. Time:{" "}
          <span className="font-semibold text-gray-900">{estTime} min</span>
        </span>
      </div>

      {/* <Button
        variant="default"
        className="bg-blue-600 text-white px-6"
        onClick={onSave}
      >
        Save Workout
      </Button> */}
    </footer>
  );
};
