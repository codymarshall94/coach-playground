import {
  buildImprovementPlan,
  coachNudgesForWeek,
  computeAll,
  ProgramSpec,
  SessionInput,
} from "@/engines/main";
import { useMemo } from "react";

// Optional tiny hash to memoize per-day work
function stableKey(x: unknown) {
  return JSON.stringify(x);
}

export function useProgramEngine(spec: ProgramSpec, sequence: SessionInput[]) {
  // Compute all layers (days + projected week). No blocks required.
  const out = useMemo(() => {
    return computeAll({
      spec,
      sequence,
    });
  }, [stableKey(spec), stableKey(sequence)]);

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
