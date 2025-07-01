import { SetInfo } from "@/types/Workout";
import { createClient } from "@/utils/supabase/client";

export async function insertExerciseSets(exerciseId: string, sets: SetInfo[]) {
  const supabase = createClient();

  const payload = sets.map((set, index) => ({
    workout_exercise_id: exerciseId,
    reps: set.reps,
    rest: set.rest,
    rpe: set.rpe ?? null,
    rir: set.rir ?? null,
    one_rep_max_percent: set.oneRepMaxPercent ?? null,
    order_num: index,
  }));

  return supabase.from("exercise_sets").insert(payload);
}
