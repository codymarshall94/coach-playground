import { Exercise, WorkoutExercise } from "@/types/Workout";
import { getExerciseETL } from "@/utils/getExerciseEtl";

/**
 * Calculates the total Estimated Training Load (ETL) for a full workout
 * @param workoutExercises - List of WorkoutExercise with sets/reps/RPE
 * @param allExerciseMeta - Full list of Exercise definitions
 * @param goal - Training goal: "strength" or "hypertrophy"
 * @returns number - Total ETL for the workout
 */
export function getWorkoutETL(
  workoutExercises: WorkoutExercise[],
  allExerciseMeta: Exercise[],
  goal: "strength" | "hypertrophy" = "hypertrophy"
): { totalETL: number; normalizedETL: number } {
  const { totalETL, normalizedETL } = workoutExercises.reduce(
    (total, wEx) => {
      const meta = allExerciseMeta.find((ex) => ex.id === wEx.id);
      if (!meta) return total; // skip if missing definition
      const etl = getExerciseETL(wEx, meta, goal);
      return {
        totalETL: total.totalETL + etl.totalETL,
        normalizedETL: total.normalizedETL + etl.normalizedETL,
      };
    },
    { totalETL: 0, normalizedETL: 0 }
  );

  return { totalETL, normalizedETL };
}
