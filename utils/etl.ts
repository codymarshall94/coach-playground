import { Exercise, WorkoutExercise } from "@/types/Workout";

// Default intensity if RPE isn't given
function estimateIntensityFromRPE(rpe: number): number {
  if (rpe >= 10) return 1.0;
  if (rpe >= 9.5) return 0.95;
  if (rpe >= 9) return 0.9;
  if (rpe >= 8) return 0.8;
  if (rpe >= 7) return 0.7;
  if (rpe >= 6) return 0.6;
  return 0.5;
}

function getIntensityFromSet(set: WorkoutExercise["sets"][0]): number {
  if (set.oneRepMaxPercent != null) return set.oneRepMaxPercent / 100;

  if (set.rir != null) {
    // RIR to intensity estimation (lower RIR = higher intensity)
    if (set.rir <= 0) return 1.0;
    if (set.rir === 1) return 0.95;
    if (set.rir === 2) return 0.9;
    if (set.rir === 3) return 0.85;
    return 0.75;
  }

  if (set.rpe != null) return estimateIntensityFromRPE(set.rpe);

  return 0.7; // default fallback if no intensity data
}

/**
 * Calculates the Estimated Training Load for a single exercise.
 * @param workoutExercise - The instance with sets and reps (WorkoutExercise)
 * @param exerciseMeta - The metadata from your EXERCISES array (Exercise)
 * @param goal - Training goal: "strength" or "hypertrophy"
 * @returns number - the ETL score
 */
export function getExerciseETL(
  workoutExercise: WorkoutExercise,
  exerciseMeta: Exercise,
  goal: "strength" | "hypertrophy" = "hypertrophy"
): { totalETL: number; normalizedETL: number } {
  const fatigue = exerciseMeta.fatigue?.index ?? 1;
  const baseVolumePerSet = exerciseMeta.volumePerSetEstimate?.[goal] ?? 10; // fallback if not defined

  let totalETL = 0;

  for (const set of workoutExercise.sets) {
    const reps = set.reps ?? 0;
    const intensity = getIntensityFromSet(set); // NEW
    totalETL += reps * intensity * fatigue * baseVolumePerSet;
  }

  const normalizedETL = totalETL / 100; // e.g. 4080 / 100 = 40.8 effort score

  // Reps (8) × Intensity (0.8) × Fatigue (0.85) × Base Volume (750) = 4080
  // 4080 / 100 = 40.8 effort score

  return { totalETL, normalizedETL };
}

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
