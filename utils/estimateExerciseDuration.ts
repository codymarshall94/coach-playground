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
  const sets = exercise.sets;

  let totalReps = 0;
  let totalRest = 0;

  sets.forEach((set, index) => {
    totalReps += set.reps;

    // Don't add rest after the last set
    if (index < sets.length - 1) {
      totalRest += set.rest;
    }
  });

  const workingTime = totalReps * secondsPerRep;
  const totalTime = workingTime + totalRest;

  return totalTime; // in seconds
}
