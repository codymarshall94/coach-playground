/**
 * Coach — Improvement Plan Builder
 * ------------------------------------------------------------
 * Purpose:
 *   Analyze sub-scores and metrics to produce a ranked list of
 *   improvement items, each with estimated points gained, a
 *   clear explanation, and concrete steps to fix.
 *
 * Philosophy:
 *   A user should NEVER feel stuck. Every item tells them
 *   exactly what to change and approximately how many score
 *   points that change is worth.
 */

import {
  DEFAULT_SET_BAND_BY_GOAL,
  GOAL_WEIGHTS,
  RECOMMENDED_MINUTES_BAND,
} from "../core/constants";
import type {
  Goal,
  ProgramMetrics,
  ProgramSpec,
  SubScores,
  WeekMetrics,
} from "../core/types";

/* ─── Public types ─── */

export type ImprovementPriority = "high" | "medium" | "low";

export interface ImprovementItem {
  /** Short headline — what's wrong */
  title: string;
  /** Which sub-score this relates to */
  dimension: keyof SubScores;
  /** One-line explanation of why this matters for the user's goal */
  why: string;
  /** Concrete numbered steps to fix it */
  steps: string[];
  /** Estimated score points gained (0-100 scale) if fully fixed */
  pointsGain: number;
  /** Urgency tier based on pointsGain */
  priority: ImprovementPriority;
  /** Current sub-score 0-1 */
  current: number;
}

/* ─── Helpers ─── */

function priorityFromGain(pts: number): ImprovementPriority {
  if (pts >= 8) return "high";
  if (pts >= 4) return "medium";
  return "low";
}

function goalLabel(goal: Goal): string {
  const map: Record<Goal, string> = {
    strength: "strength",
    hypertrophy: "muscle growth",
    athletic: "athletic performance",
    fat_loss: "fat loss",
    endurance: "endurance",
    power: "power development",
  };
  return map[goal] ?? goal;
}

/* ─── Main Builder ─── */

export function buildImprovementPlan(
  spec: ProgramSpec,
  week: WeekMetrics,
  program: ProgramMetrics | undefined,
): ImprovementItem[] {
  if (!program) return [];

  const sub = program.subScores;
  const weights = GOAL_WEIGHTS[spec.goal];
  const items: ImprovementItem[] = [];
  const gl = goalLabel(spec.goal);

  // For each sub-score, compute the potential gain if it were raised to 1.0
  // gain = weight × (1.0 - current) × 100
  const potentials = (Object.keys(sub) as (keyof SubScores)[]).map((dim) => ({
    dim,
    current: sub[dim],
    weight: weights[dim],
    gain: Math.round(weights[dim] * (1 - sub[dim]) * 100),
  }));

  // Sort by potential gain descending
  potentials.sort((a, b) => b.gain - a.gain);

  for (const p of potentials) {
    // Skip if already near-perfect or gain is negligible
    if (p.current >= 0.95 || p.gain < 1) continue;

    const item = buildItemForDimension(
      p.dim,
      p.current,
      p.gain,
      spec,
      week,
      program,
      gl,
    );
    if (item) items.push(item);
  }

  return items;
}

/* ─── Per-dimension item builders ─── */

function buildItemForDimension(
  dim: keyof SubScores,
  current: number,
  gain: number,
  spec: ProgramSpec,
  week: WeekMetrics,
  program: ProgramMetrics,
  goalLabel: string,
): ImprovementItem | null {
  const priority = priorityFromGain(gain);
  const base = { dimension: dim, pointsGain: gain, priority, current };

  switch (dim) {
    case "volumeFit":
      return buildVolumeFitItem(base, spec, week, program, goalLabel);
    case "intensityFit":
      return buildIntensityFitItem(base, spec, week, goalLabel);
    case "stressPatterning":
      return buildStressPatterningItem(base, week);
    case "balanceHealth":
      return buildBalanceItem(base, week);
    case "specificity":
      return buildSpecificityItem(base, program, goalLabel);
    case "progression":
      return buildProgressionItem(base, goalLabel);
    case "feasibility":
      return buildFeasibilityItem(base, spec, program);
    default:
      return null;
  }
}

type ItemBase = Pick<
  ImprovementItem,
  "dimension" | "pointsGain" | "priority" | "current"
>;

function buildVolumeFitItem(
  base: ItemBase,
  spec: ProgramSpec,
  week: WeekMetrics,
  program: ProgramMetrics,
  gl: string,
): ImprovementItem {
  const [minSet, maxSet] =
    DEFAULT_SET_BAND_BY_GOAL[
      spec.goal as keyof typeof DEFAULT_SET_BAND_BY_GOAL
    ] ?? [10, 20];

  // Find which priority muscles are outside the band
  const priorities = program.priorityMusclesAuto;
  const underHit = priorities.filter(
    (m) => (week.volumeByMuscle[m] ?? 0) < minSet,
  );
  const overHit = priorities.filter(
    (m) => (week.volumeByMuscle[m] ?? 0) > maxSet,
  );

  const steps: string[] = [];
  if (underHit.length > 0) {
    const names = underHit.slice(0, 3).map(formatMuscleName);
    const setsNeeded = underHit
      .slice(0, 3)
      .map((m) => Math.ceil(minSet - (week.volumeByMuscle[m] ?? 0)));
    steps.push(
      `Add sets for ${names.map((n, i) => `${n} (+${setsNeeded[i]})`).join(", ")} to reach at least ${minSet} sets/week each.`,
    );
    steps.push(
      "Spread extra sets across multiple days rather than loading one session.",
    );
  }
  if (overHit.length > 0) {
    const names = overHit.slice(0, 3).map(formatMuscleName);
    steps.push(
      `Trim volume for ${names.join(", ")} — aim for ≤${maxSet} sets/week to avoid junk volume.`,
    );
  }
  if (steps.length === 0) {
    steps.push(
      `Aim for ${minSet}–${maxSet} weekly sets per major muscle group for ${gl}.`,
    );
  }

  return {
    ...base,
    title: "Volume isn't optimized for your goal",
    why: `For ${gl}, your key muscles need ${minSet}–${maxSet} effective sets per week to maximize adaptation.`,
    steps,
  };
}

function buildIntensityFitItem(
  base: ItemBase,
  spec: ProgramSpec,
  week: WeekMetrics,
  gl: string,
): ImprovementItem {
  const ih = week.intensityHistogram;
  const steps: string[] = [];

  if (spec.goal === "strength") {
    const hi = Math.round((ih.high ?? 0) * 100);
    steps.push(
      `Currently ${hi}% of sessions are high-intensity — aim for ≥25%.`,
    );
    steps.push(
      "Add a day focused on heavy compound lifts (squat, bench, deadlift) at 80–90% 1RM for 3–5 reps.",
    );
    steps.push(
      "Keep other days moderate (65–80%) to recover while still building volume.",
    );
  } else if (spec.goal === "hypertrophy") {
    const mid = Math.round((ih.moderate ?? 0) * 100);
    steps.push(
      `Currently ${mid}% of sessions are moderate-intensity — aim for ≥50%.`,
    );
    steps.push(
      "Focus most days on 65–80% 1RM for 8–12 reps. This is the hypertrophy sweet spot.",
    );
    steps.push(
      "Save heavy (85%+) work for 1–2 exercises per week to preserve strength.",
    );
  } else if (spec.goal === "endurance") {
    const lo = Math.round((ih.low ?? 0) * 100);
    steps.push(
      `Currently ${lo}% of sessions are low-intensity — aim for ≥40%.`,
    );
    steps.push(
      "Increase light circuit-style work with higher rep ranges (15–20+).",
    );
  } else if (spec.goal === "power") {
    const hi = Math.round((ih.high ?? 0) * 100);
    steps.push(
      `Currently ${hi}% of sessions are high-intensity — aim for ≥30%.`,
    );
    steps.push(
      "Pair heavy compound lifts (1–5 reps at 80–95% 1RM) with explosive movements like jumps and throws.",
    );
    steps.push(
      "Keep accessory work moderate to support recovery between power sessions.",
    );
  } else {
    steps.push(
      "Mix intensities: roughly 20% heavy, 50% moderate, 30% light for balanced adaptation.",
    );
  }

  return {
    ...base,
    title: "Intensity mix doesn't match your goal",
    why: `${capitalize(gl)} responds best to specific effort distributions. Your current split isn't ideal.`,
    steps,
  };
}

function buildStressPatterningItem(
  base: ItemBase,
  week: WeekMetrics,
): ImprovementItem {
  const flags = week.spacingFlags;
  const steps: string[] = [];

  if (flags.some((f) => f.includes("Back-to-back High"))) {
    steps.push(
      "Insert a rest day or light session between your two heaviest training days.",
    );
  }
  if (flags.some((f) => f.includes(">2 High"))) {
    steps.push(
      "Change one of your heavy days to a moderate session — you have too many high-stress days clustered together.",
    );
  }
  if (steps.length === 0) {
    steps.push(
      "Alternate heavy and light days throughout the week for better recovery.",
    );
  }
  steps.push(
    "A good pattern: Heavy → Light → Moderate → Rest → Heavy → Moderate → Rest.",
  );

  return {
    ...base,
    title: "Recovery between hard sessions needs work",
    why: "Stacking heavy days limits recovery and increases injury risk. Your body adapts during rest, not during training.",
    steps,
  };
}

function buildBalanceItem(
  base: ItemBase,
  week: WeekMetrics,
): ImprovementItem {
  const r = week.balanceRatios;
  const steps: string[] = [];

  if (r.pushPull && r.pushPull > 1.3) {
    steps.push(
      "Add 3–4 rowing or pulldown sets per week to balance your push-heavy upper body.",
    );
  } else if (r.pushPull && r.pushPull < 0.77) {
    steps.push(
      "Add 3–4 pressing sets (bench, overhead press) per week — you're pull-heavy.",
    );
  }

  if (r.quadHam && r.quadHam > 1.3) {
    steps.push(
      "Add posterior chain work: 3–4 sets of RDLs, hip thrusts, or hamstring curls.",
    );
  } else if (r.quadHam && r.quadHam < 0.77) {
    steps.push(
      "Add 3–4 sets of squats, lunges, or leg press to bring up quad volume.",
    );
  }

  if (r.upperLower && r.upperLower > 1.3) {
    steps.push(
      "Your program is upper-body dominant. Add one lower-body exercise or 4–6 extra leg sets.",
    );
  } else if (r.upperLower && r.upperLower < 0.77) {
    steps.push(
      "Your program is lower-body dominant. Add 4–6 upper-body sets across the week.",
    );
  }

  if (steps.length === 0) {
    steps.push(
      "Your balance is close — keep ratios between 0.8 and 1.2 for injury prevention.",
    );
  }

  return {
    ...base,
    title: "Muscle balance could be more even",
    why: "Imbalanced push/pull and upper/lower ratios can cause injuries and limit overall development.",
    steps,
  };
}

function buildSpecificityItem(
  base: ItemBase,
  program: ProgramMetrics,
  gl: string,
): ImprovementItem {
  const low = program.lowAttentionMuscles.slice(0, 4).map(formatMuscleName);
  const steps: string[] = [];

  steps.push(
    "Make sure your highest-volume exercises directly target the muscles that matter most for your goal.",
  );
  if (low.length > 0) {
    steps.push(
      `These muscles are getting very little work: ${low.join(", ")}. Add 2–4 sets each if they're relevant to ${gl}.`,
    );
  }
  steps.push(
    "Swap isolation exercises for compounds that hit multiple priority muscles at once.",
  );

  return {
    ...base,
    title: "Training isn't specific enough to your goal",
    why: `For ${gl}, your priority muscles should get noticeably more volume than secondary ones.`,
    steps,
  };
}

function buildProgressionItem(
  base: ItemBase,
  gl: string,
): ImprovementItem {
  return {
    ...base,
    title: "Progression strategy could improve",
    why: `${capitalize(gl)} requires structured overload over time. Flat volume across weeks leaves gains on the table.`,
    steps: [
      "Gradually increase total sets or weight week-over-week across your training block.",
      "Plan a deload week (reduce volume 30–40%) every 4–6 weeks to let your body recover.",
      "Track your lifts — even small jumps in weight or reps each week compound into big gains.",
    ],
  };
}

function buildFeasibilityItem(
  base: ItemBase,
  spec: ProgramSpec,
  program: ProgramMetrics,
): ImprovementItem {
  const [recMin, recMax] =
    RECOMMENDED_MINUTES_BAND[
      spec.goal as keyof typeof RECOMMENDED_MINUTES_BAND
    ] ?? [150, 240];
  const actual = Math.round(program.avgWeeklyMinutes);
  const steps: string[] = [];

  if (actual > recMax) {
    const over = actual - recMax;
    steps.push(
      `Your weekly total is ~${actual} min — ${over} min over the recommended range (${recMin}–${recMax} min).`,
    );
    steps.push(
      "Remove 1–2 isolation exercises from your longest session, or cut a set from each exercise.",
    );
    steps.push(
      "Shorter sessions are easier to stick to. Consistency matters more than any single workout.",
    );
  } else if (actual < recMin) {
    const under = recMin - actual;
    steps.push(
      `Your weekly total is ~${actual} min — ${under} min under the minimum (${recMin}–${recMax} min).`,
    );
    steps.push(
      "Add an exercise to 1–2 sessions, or add one more training day to your week.",
    );
    steps.push(
      "Insufficient training time can limit the stimulus your muscles need to adapt.",
    );
  } else {
    steps.push(
      `Your weekly total (~${actual} min) fits within the ${recMin}–${recMax} min range. Nice!`,
    );
  }

  return {
    ...base,
    title: "Weekly time budget needs adjustment",
    why: `Programs that fit your schedule are programs you'll stick with. Aim for ${recMin}–${recMax} min/week.`,
    steps,
  };
}

/* ─── Formatting utilities ─── */

function formatMuscleName(id: string): string {
  return id
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
