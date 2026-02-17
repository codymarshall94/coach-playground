import { WorkoutExercise } from "@/types/Workout";

// ─── Realistic time constants ────────────────────────────────────
// Based on real-world gym observation, not just rep×seconds math.

/** Average time per rep in seconds (includes eccentric + concentric + brief pause) */
const SECONDS_PER_REP = 4;

/**
 * Time to perform a single set beyond just the reps:
 * unracking, bracing, re-racking, wiping down, logging, etc.
 */
const SET_OVERHEAD_SECONDS = 15;

/**
 * Transition time when switching between exercises:
 * walking to the next station, loading plates / adjusting machine,
 * doing a quick warm-up set, getting settled. ~2 min average.
 */
const EXERCISE_TRANSITION_SECONDS = 120;

/**
 * A small buffer for the overall session: getting to the gym floor,
 * filling water, general warm-up, and cool-down. Applied once.
 */
const SESSION_OVERHEAD_SECONDS = 300; // 5 min

/** Default rest between sets when none is specified */
const DEFAULT_REST_SECONDS = 90;

/**
 * Estimate time in seconds to complete a single exercise (all its sets).
 *
 * Per-set time = (reps × SECONDS_PER_REP) + SET_OVERHEAD + rest
 * Plus one EXERCISE_TRANSITION at the start (moving to the station).
 */
export function estimateExerciseDuration(
  exercise: WorkoutExercise
): number {
  const sets = exercise.sets ?? [];
  if (sets.length === 0) return 0;

  let total = EXERCISE_TRANSITION_SECONDS; // transition to this station

  sets.forEach((set, index) => {
    const reps = set.reps ?? 0;

    // Time under tension for this set
    total += reps * SECONDS_PER_REP;

    // Per-set overhead (unrack, brace, re-rack, notes)
    total += SET_OVERHEAD_SECONDS;

    // Rest after every set except the last
    if (index < sets.length - 1) {
      total += set.rest ?? DEFAULT_REST_SECONDS;
    }
  });

  return total;
}

/**
 * Estimate total workout duration in seconds for a list of exercises.
 * Adds a session overhead for general warm-up / cool-down.
 */
export function estimateWorkoutDuration(workout: WorkoutExercise[]): number {
  if (workout.length === 0) return 0;

  const exerciseTime = workout.reduce(
    (sum, exercise) => sum + estimateExerciseDuration(exercise),
    0
  );

  return exerciseTime + SESSION_OVERHEAD_SECONDS;
}
