import { createClient } from "@/utils/supabase/client";

export async function deleteProgram(id: string) {
  const supabase = createClient();
  console.info("[deleteProgram] starting delete", { id });
  try {
    // Log current authenticated user/session
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.info("[deleteProgram] supabase user", { user });
    } catch (sErr) {
      console.warn("[deleteProgram] failed to get user", sErr);
    }

    // Inspect the row before attempting delete to see owner and existence
    const { data: before, error: beforeErr } = await supabase
      .from("programs")
      .select("id,user_id,created_at,updated_at")
      .eq("id", id)
      .maybeSingle();

    console.info("[deleteProgram] pre-delete row check", { before, beforeErr });

    // Perform delete and request deleted rows back
    const { data: delData, error: delError } = await supabase
      .from("programs")
      .delete()
      .eq("id", id)
      .select("id,user_id");

    console.info("[deleteProgram] delete response", { delData, delError });

    if (delError) {
      console.error("[deleteProgram] error deleting program", delError);
      throw new Error(`deleteProgram: ${delError.message}`);
    }

    // If delete returned no rows, surface a warning to help debug RLS/permissions
    if (!delData || (Array.isArray(delData) && delData.length === 0)) {
      console.warn(
        "[deleteProgram] delete completed but returned no rows - possible RLS or no-match",
        { id, before }
      );
    }

    return delData;
  } catch (err) {
    console.error("[deleteProgram] unexpected error", err);
    throw err;
  }
}
