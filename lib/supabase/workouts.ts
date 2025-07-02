import { createClient } from "@/utils/supabase/client";

export async function insertWorkout(dayId: string) {
  const supabase = createClient();

  return supabase.from("workouts").insert({ day_id: dayId }).select().single();
}
