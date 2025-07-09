import { createClient } from "@/utils/supabase/client";

export async function fetchAllExercises() {
  const supabase = createClient();
  return supabase.from("exercises").select("*");
}

export async function fetchExerciseById(id: string | null | undefined) {
  if (!id) return null; // ⛔️ Don't query if no ID

  const supabase = createClient();

  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
