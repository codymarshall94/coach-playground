import {
  buildImprovementPlan,
  coachNudgesForWeek,
  computeAll,
  ProgramSpec,
  SessionInput,
} from "@/engines/main";
import type { BlockInput } from "@/engines/main/orchestrator";
import { useMemo } from "react";

// Optional tiny hash to memoize per-day work
function stableKey(x: unknown) {
  return JSON.stringify(x);
}

export function useProgramEngine(
  spec: ProgramSpec,
  sequence: SessionInput[],
  blocks?: BlockInput[]
) {
  // Compute all layers (days + week + block + program)
  const out = useMemo(() => {
    return computeAll({
      spec,
      sequence,
      blocks,
    });
  }, [stableKey(spec), stableKey(sequence), stableKey(blocks)]);

  // Build coach nudges for the projected week
  const nudges = useMemo(() => {
    return coachNudgesForWeek(out.week, spec);
  }, [stableKey(out.week), stableKey(out.days), stableKey(spec)]);

  // Build ranked improvement plan from sub-scores
  const improvements = useMemo(() => {
    return buildImprovementPlan(spec, out.week, out.program);
  }, [stableKey(spec), stableKey(out.week), stableKey(out.program)]);

  return { ...out, nudges, improvements };
}
