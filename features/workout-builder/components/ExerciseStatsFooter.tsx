import { Exercise } from "@/types/Exercise";
import { WorkoutExercise } from "@/types/Workout";
import { getExerciseETL } from "@/utils/etl";
import { estimateExerciseDuration } from "@/utils/volume/estimateExerciseDuration";
import { ETLDisplay } from "./insights/EtlDisplay";

export const ExerciseStatsFooter = ({
  exercise,
  exerciseMeta,
}: {
  exercise: WorkoutExercise;
  exerciseMeta: Exercise;
}) => {
  const totalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0);

  const { totalETL } = getExerciseETL(exercise, exerciseMeta);

  return (
    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
      <div className="flex items-center gap-4">
        <ETLDisplay etl={totalETL} />
        <span>
          Total Reps:{" "}
          <span className="font-medium text-gray-700">{totalReps}</span>
        </span>
      </div>
      <div>
        Est. Time:{" "}
        <span className="font-medium text-gray-700">
          {Math.ceil(estimateExerciseDuration(exercise) / 60)} min
        </span>
      </div>
    </div>
  );
};
