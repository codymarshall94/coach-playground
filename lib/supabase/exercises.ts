import { createClient } from "@/utils/supabase/client";

export async function fetchAllExercises() {
  const supabase = createClient();
  console.log("Fetching exercises...");
  return supabase.from("exercises").select("*");
}

export async function fetchExerciseById(id: string) {
  const supabase = createClient();
  return supabase.from("exercises").select("*").eq("id", id).single();
}
