import { createClient } from "@/utils/supabase/client";

export async function insertProgram({
  user_id,
  name,
  description,
  goal,
  mode,
}: {
  user_id: string;
  name: string;
  description: string;
  goal: string;
  mode: "days" | "blocks";
}) {
  const supabase = createClient();

  return supabase
    .from("programs")
    .insert({ user_id, name, description, goal, mode })
    .select()
    .single();
}
