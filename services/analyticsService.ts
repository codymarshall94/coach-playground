import { createClient } from "@/utils/supabase/client";

/**
 * Record a page view for a published program.
 * Uses an RPC with built-in dedup (1 view per viewer per program per day).
 */
export async function recordProgramView(programId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("record_program_view", {
    p_program_id: programId,
  });
  if (error) {
    // Non-critical — don't throw, just log
    console.warn("[analyticsService] recordProgramView error:", error.message);
  }
}

/**
 * Fetch view counts for all programs owned by the current user.
 * Returns a map of programId → viewCount.
 */
export async function getMyProgramViewCounts(): Promise<
  Record<string, number>
> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_my_program_view_counts");
  if (error) {
    console.error(
      "[analyticsService] getMyProgramViewCounts error:",
      error.message
    );
    return {};
  }
  const map: Record<string, number> = {};
  for (const row of data ?? []) {
    map[row.program_id] = row.view_count;
  }
  return map;
}
