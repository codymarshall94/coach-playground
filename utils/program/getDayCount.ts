import type { Program, ProgramDay } from "@/types/Workout";

type Options = {
  /** Count rest/active_rest days too? Default: true */
  includeRest?: boolean;
  /**
   * How to derive the count when using blocks:
   * - "first": use the first block's day count
   * - "max": use the maximum day count across blocks (default)
   * - "sum": sum all blocks' day counts (rarely what you want for cards)
   */
  blocksStrategy?: "first" | "max" | "sum";
};

function countDays(
  days: ProgramDay[] | undefined,
  includeRest: boolean
): number {
  if (!days?.length) return 0;
  return days.filter((d) => includeRest || d.type === "workout").length;
}

/**
 * Get the "day count" for a Program.
 * For block mode, defaults to the MAX day count across blocks (typical weekly/phase load).
 */
export function getProgramDayCount(
  program: Program,
  opts: Options = {}
): number {
  const { includeRest = true, blocksStrategy = "max" } = opts;

  // Prefer blocks when in block mode and blocks exist, else fall back to root days
  if (program.mode === "blocks" && program.blocks?.length) {
    const perBlock = program.blocks.map((b) => countDays(b?.days, includeRest));

    if (!perBlock.length) return 0;

    switch (blocksStrategy) {
      case "first":
        return perBlock[0] ?? 0;
      case "sum":
        return perBlock.reduce((a, b) => a + b, 0);
      case "max":
      default:
        return Math.max(...perBlock);
    }
  }

  return countDays(program.days, includeRest);
}
