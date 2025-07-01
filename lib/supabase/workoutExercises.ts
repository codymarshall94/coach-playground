import { WorkoutExercise } from "@/types/Workout";
import { createClient } from "@/utils/supabase/client";

export async function insertWorkoutExercises(
  workoutId: string,
  exercises: WorkoutExercise[]
) {
  const supabase = createClient();

  const payload = exercises.map((ex, index) => ({
    workout_id: workoutId,
    name: ex.name,
    intensity: ex.intensity,
    notes: ex.notes ?? "",
    order_num: index,
  }));

  return supabase.from("workout_exercises").insert(payload).select();
}
