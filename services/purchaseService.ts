import { createClient } from "@/utils/supabase/client";

// ---------------------------------------------------------------------------
// Client-side purchase helpers
// ---------------------------------------------------------------------------

/**
 * Acquire a published program (add to user's library).
 * Currently handles free programs only — paid programs will go through a
 * payment flow that calls a separate server-side function.
 *
 * Returns the purchase ID (or the existing one if already acquired).
 */
export async function acquireProgram(programId: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("acquire_program", {
    p_program_id: programId,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

/** Shape returned by `get_my_purchased_programs` RPC. */
export interface PurchasedProgram {
  purchase_id: string;
  purchased_at: string;
  price_paid: number | null;
  program_id: string;
  program_name: string;
  program_description: string | null;
  program_goal: string;
  program_mode: string;
  program_cover_image: string | null;
  program_slug: string | null;
  author_username: string | null;
  author_full_name: string | null;
  author_avatar_url: string | null;
}

/**
 * Check if the current user has already acquired a specific program.
 */
export async function hasAcquiredProgram(
  programId: string,
): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("program_purchases")
    .select("id")
    .eq("program_id", programId)
    .limit(1);

  if (error) {
    console.warn("[purchaseService] hasAcquiredProgram error:", error.message);
    return false;
  }

  return (data?.length ?? 0) > 0;
}
