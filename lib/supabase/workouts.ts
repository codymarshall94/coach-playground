import { createClient } from "@/utils/supabase/client";

export async function insertWorkout(dayId: string) {
  const supabase = createClient();

  return supabase
    .from("workouts")
    .insert({ program_day_id: dayId }) // or block_day_id if in block mode
    .select()
    .single();
}
