/**
 * Coach — Nudge Generator
 * ------------------------------------------------------------
 * Purpose:
 *   Turn week metrics + spec into short, actionable suggestions.
 *
 * Style:
 *   Keep messages specific and positive; one fix per nudge.
 */

import { ProgramSpec, WeekMetrics, WeeklyTargets } from "@/engines/core/types";

type NudgeOptions = {
  targets?: WeeklyTargets; // optional override
  minutesCapSlack?: number; // allow % over time cap before nudging (default 10%)
  ratioHigh?: number; // imbalance threshold high side (default 1.5)
  ratioLow?: number; // imbalance threshold low side (default 0.67)
};

export function coachNudgesForWeek(
  week: WeekMetrics,
  spec?: ProgramSpec,
  opts?: NudgeOptions
): string[] {
  const nudges: string[] = [];
  const ratioHigh = opts?.ratioHigh ?? 1.5;
  const ratioLow = opts?.ratioLow ?? 0.67;

  // 1) Spacing flags → direct echo
  for (const f of week.spacingFlags) {
    if (f.includes("Back-to-back High")) {
      nudges.push(
        "Separate back-to-back High days by inserting a Low/Rest slot."
      );
    } else if (f.includes(">2 High in 3")) {
      nudges.push(
        "Limit to ≤2 High days within any 3 sessions; swap one to Medium/Low."
      );
    } else {
      nudges.push(f);
    }
  }

  // 2) Balance ratios
  const r = week.balanceRatios;
  if (r.pushPull && (r.pushPull > ratioHigh || r.pushPull < ratioLow)) {
    nudges.push(
      r.pushPull > 1
        ? "Push:Pull is high—add 3–4 pulling sets (rows/pulldowns) this week."
        : "Push:Pull is low—add 3–4 pressing sets (bench/overhead) this week."
    );
  }
  if (r.quadHam && (r.quadHam > ratioHigh || r.quadHam < ratioLow)) {
    nudges.push(
      r.quadHam > 1
        ? "Quad:Ham is high—add hip hinge work (RDLs, hip thrusts) for 3–4 sets."
        : "Quad:Ham is low—add quad emphasis (squats/split squats) for 3–4 sets."
    );
  }
  if (r.upperLower && (r.upperLower > ratioHigh || r.upperLower < ratioLow)) {
    nudges.push(
      r.upperLower > 1
        ? "Upper:Lower is upper-biased—add one lower-body slot or 4–6 sets to legs."
        : "Upper:Lower is lower-biased—add one upper-body slot or 4–6 sets to upper."
    );
  }

  // 3) Coverage vs. targets (if provided)
  const targets = opts?.targets ?? spec?.targets;
  if (targets?.setsPerMuscle) {
    for (const m of Object.keys(targets.setsPerMuscle)) {
      const got = week.volumeByMuscle[m] ?? 0;
      const [min, max] = targets.setsPerMuscle[m] ?? [0, Infinity];
      if (got < min)
        nudges.push(
          `${m}: add ${Math.ceil(min - got)} sets to reach the target band.`
        );
      else if (got > max)
        nudges.push(
          `${m}: consider removing ${Math.ceil(
            got - max
          )} sets to stay within target.`
        );
    }
  }

  // 4) Intensity mix by goal (simple guidance)
  if (spec?.goal === "strength" && (week.intensityHistogram.high ?? 0) < 0.25) {
    nudges.push(
      "For strength, include at least ~25% High-intensity sessions (heavy top sets)."
    );
  }
  if (
    spec?.goal === "hypertrophy" &&
    (week.intensityHistogram.moderate ?? 0) < 0.5
  ) {
    nudges.push(
      "For hypertrophy, ensure ≥50% Medium-intensity sessions with sufficient volume."
    );
  }

  // 5) Feasibility: minutes vs time cap
  if (spec?.constraints?.timeCapMin) {
    const cap = spec.constraints.timeCapMin;
    const slack = (opts?.minutesCapSlack ?? 0.1) * cap; // default +10%
    if (week.projectedWeeklyMinutes > cap + slack) {
      nudges.push(
        `Time: reduce ~${
          Math.round((week.projectedWeeklyMinutes - cap) / 10) * 10
        } minutes this week to fit your cap.`
      );
    }
  }

  return nudges;
}
