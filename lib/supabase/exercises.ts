// services/exercises.ts
import { createClient } from "@/utils/supabase/client";

type FetchAllExercisesOptions = {
  limit?: number; // default 50
  offset?: number; // for pagination
  withMusclesOnly?: boolean; // inner join vs left join
  orderBy?: "name" | "category" | "id"; // valid columns in your table
};

export async function fetchAllExercises(opts: FetchAllExercisesOptions = {}) {
  const {
    limit = 50,
    offset = 0,
    withMusclesOnly = false,
    orderBy = "name",
  } = opts;

  const supabase = createClient();

  const { data, error } = await supabase
    .from("exercises")
    .select(
      `
      id,
      name,
      category,
      equipment,
      image_url,
      exercise_muscles${withMusclesOnly ? "!inner" : ""}(
        contribution,
        muscles(
          id,
          display_name,
          group_name
        )
      )
    `
    )
    .order(orderBy, { ascending: true, nullsFirst: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[fetchAllExercises] supabase error:", error);
    return { data: [], error };
  }
  return { data: data ?? [], error: null };
}

/** Get one exercise by id, with its muscle mappings. Returns null on 404. */
export async function fetchExerciseById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("exercises")
    .select(
      `
      id,
      name,
      category,
      equipment,
      image_url,
      exercise_muscles(
        contribution,
        muscles(
          id,
          display_name,
          group_name
        )
      )
    `
    )
    .eq("id", id)
    .single();

  // PGRST116 = no rows found (404)
  if (error && "code" in error && error.code !== "PGRST116") {
    console.error("[fetchExerciseById] supabase error:", error);
    throw new Error(error.message);
  }
  return data ?? null;
}
