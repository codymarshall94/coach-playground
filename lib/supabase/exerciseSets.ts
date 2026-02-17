import { SetInfo } from "@/types/Workout";
import { createClient } from "@/utils/supabase/client";

/**
 * Insert all sets for ONE exercise in a single call.
 * Returns nothing (fast path). If you truly need rows back, switch to .select().
 */
export async function insertExerciseSets(
  workoutExerciseId: string,
  sets: SetInfo[]
) {
  if (!sets?.length) return;

  const payload = sets.map((set, index) => ({
    workout_exercise_id: workoutExerciseId,
    set_index: index,
    set_type: set.set_type ?? "standard",
    rest: set.rest,
    rpe: set.rpe ?? null,
    rir: set.rir ?? null,
    one_rep_max_percent: set.one_rep_max_percent ?? null,
    notes: set.notes ?? null,
  }));

  const { error } = await createClient().from("exercise_sets").insert(payload);

  if (error) throw new Error(`insertExerciseSets: ${error.message}`);
}
