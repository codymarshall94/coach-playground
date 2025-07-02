import { SetInfo } from "@/types/Workout";
import { createClient } from "@/utils/supabase/client";

export async function insertExerciseSets(
  workoutExerciseId: string,
  sets: SetInfo[]
) {
  const supabase = createClient();

  const payload = sets.map((set, index) => ({
    exercise_id: workoutExerciseId, // ✅ from workout_exercises, not exercises
    reps: set.reps,
    rest: set.rest,
    rpe: set.rpe ?? null,
    rir: set.rir ?? null,
    one_rep_max_percent: set.oneRepMaxPercent ?? null,
    order_num: index,
  }));

  const { data, error } = await supabase.from("exercise_sets").insert(payload);

  if (error) {
    console.error("Error inserting exercise sets", error);
  }

  return data;
}
