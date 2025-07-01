import { WorkoutExercise } from "@/types/Workout";
import { estimateExerciseDuration } from "@/utils/volume/estimateExerciseDuration";
import { IntensitySystem, Exercise } from "@/types/Workout";
import { ETLDisplay } from "./insights/EtlDisplay";

export const ExerciseStatsFooter = ({
  exercise,
  intensitySystem,
  exerciseMeta,
}: {
  exercise: WorkoutExercise;
  intensitySystem: IntensitySystem;
  exerciseMeta: Exercise;
}) => {
  const totalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0);
  const avgIntensity =
    exercise.sets.reduce((sum, set) => {
      if (intensitySystem === "rpe") return sum + (set.rpe ?? 8);
      if (intensitySystem === "rir") return sum + (10 - (set.rir ?? 2));
      if (intensitySystem === "oneRepMaxPercent")
        return sum + (set.oneRepMaxPercent ?? 75) / 100;
      return sum + 0.8;
    }, 0) / exercise.sets.length;

  const baseVolume = exerciseMeta?.volumePerSetEstimate?.hypertrophy ?? 10;

  return (
    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
      <div className="flex items-center gap-4">
        <ETLDisplay
          etl={0} // optional: pass actual ETL here or calculate
          formula={{
            reps: totalReps,
            intensity: avgIntensity,
            fatigue: exerciseMeta?.fatigue?.index ?? 1,
            baseVolume,
          }}
        />
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
