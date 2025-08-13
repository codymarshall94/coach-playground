import { WorkoutExercise } from "@/types/Workout";

/**
 * Estimate time in seconds to complete a workout exercise
 * Assumptions:
 * - Each rep takes `secondsPerRep` seconds
 * - Rest only occurs between sets (not after the final set)
 */
export function estimateExerciseDuration(
  exercise: WorkoutExercise,
  secondsPerRep: number = 4
): number {
  const sets = exercise.sets ?? [];

  let totalReps = 0;
  let totalRest = 0;

  sets.forEach((set, index) => {
    totalReps += set.reps ?? 0;

    if (index < sets.length - 1) {
      totalRest += set.rest ?? 90; // fallback
    }
  });

  const workingTime = totalReps * secondsPerRep;

  // Returns the total time in seconds
  return workingTime + totalRest;
}

export function estimateWorkoutDuration(workout: WorkoutExercise[]): number {
  return workout.reduce(
    (sum, exercise) => sum + estimateExerciseDuration(exercise),
    0
  );
}
