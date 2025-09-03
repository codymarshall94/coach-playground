import { createClient } from "@/utils/supabase/client";

export async function deleteProgram(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) throw new Error(`deleteProgram: ${error.message}`);
}
