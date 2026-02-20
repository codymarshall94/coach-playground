import { createClient } from "@/utils/supabase/client";
import { transformProgramFromSupabase } from "@/utils/program/transformProgram";
import { PROGRAM_DETAIL_SELECT } from "@/services/programQueries";

/**
 * Lightweight list for template picker cards.
 * We only need top-level fields and day IDs to count days.
 */
export const getTemplates = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      id,
      name,
      description,
      goal,
      mode,
      days:program_days ( id )
    `
    )
    .eq("is_template", true)
    .order("name");

  if (error) throw new Error(error.message || "Failed to load templates");
  // Add a computed daysCount for convenience
  return (data ?? []).map((t) => ({
    ...t,
    daysCount: Array.isArray(t.days) ? t.days.length : 0,
  }));
};

/**
 * If you need a single full template (rare on chooser), keep this:
 */
export const getTemplateByIdFull = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("programs")
    .select(PROGRAM_DETAIL_SELECT)
    .eq("id", id)
    .eq("is_template", true)
    .single();

  if (error) throw new Error(error.message || "Failed to load template");
  return transformProgramFromSupabase(data);
};
