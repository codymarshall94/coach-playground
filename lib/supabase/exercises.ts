import { createClient } from "@/utils/supabase/client";

export async function fetchAllExercises() {
  const supabase = createClient();

  const { data, error } = await supabase.from("exercises").select(`
    *,
    exercise_muscles!inner(
      contribution,
      muscles(
        id,
        display_name,
        group_name
      )
    )
  `);

  console.log(data);

  return { data, error };
}

export async function fetchExerciseById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("exercises")
    .select(
      `
      *,
      exercise_muscles (
        role,
        contribution,
        muscles (
          id,
          display_name,
          group_name
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
