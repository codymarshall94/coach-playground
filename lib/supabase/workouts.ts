import { createClient } from "@/utils/supabase/client";
export async function insertWorkout(dayId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("workouts")
    .insert({ day_id: dayId })
    .select("id")
    .single();

  if (error) throw new Error(`insertWorkout: ${error.message}`);
  return data as { id: string };
}
