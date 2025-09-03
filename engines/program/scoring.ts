/**
 * Program Engine — Scoring Builder
 * ------------------------------------------------------------
 * Purpose:
 *   Compute goal-aware subscores and combine them with weights.
 *
 * Key Dimensions:
 *   - specificity, progression, stressPatterning, volumeFit,
 *     intensityFit, balanceHealth, feasibility
 */

// engines/program/scoring.ts
import {
  DEFAULT_SET_BAND_BY_GOAL,
  GOAL_WEIGHTS,
  LOW_ATTENTION_THRESHOLD,
  RECOMMENDED_MINUTES_BAND,
} from "../core/constants";
import { BlockMetrics, ProgramSpec } from "../core/types";
import { avg, clamp01 } from "../core/utils/math";

const loadFromRole = { High: 85, Medium: 55, Low: 25 };

export function scoreProgram(spec: ProgramSpec, blocks: BlockMetrics[]) {
  // ---- Aggregate per-week coverage across the whole program ----
  const coverageHeatmap: Record<string, number> = {};
  const allWeeks = blocks.flatMap((b) => b.weekly);

  for (const w of allWeeks)
    for (const [m, v] of Object.entries(w.volumeByMuscle))
      coverageHeatmap[m] = (coverageHeatmap[m] ?? 0) + v;

  // Build weekly averages we can show in the UI (more interpretable than totals)
  const weeksCount = Math.max(1, allWeeks.length);
  const weeklyAvgByMuscle: Record<string, number> = {};
  for (const [m, sum] of Object.entries(coverageHeatmap))
    weeklyAvgByMuscle[m] = sum / weeksCount;

  // Auto-priority = top 6 muscles by weekly avg volume
  const priorityMusclesAuto = Object.entries(weeklyAvgByMuscle)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([m]) => m);

  // ---- Subscores (0..1) ----
  const weights = GOAL_WEIGHTS[spec.goal];

  // Specificity: priority vs non-priority coverage
  const priSum = priorityMusclesAuto.reduce(
    (a, m) => a + (weeklyAvgByMuscle[m] ?? 0),
    0
  );
  const nonPriSum = Object.entries(weeklyAvgByMuscle)
    .filter(([m]) => !priorityMusclesAuto.includes(m))
    .reduce((a, [, v]) => a + v, 0);
  const specificity = clamp01(
    0.5 + 0.25 * Math.log2(1 + priSum / Math.max(1, nonPriSum))
  );

  // Progression: rising trend + deload bonus (use your existing block flags)
  const progression = clamp01(
    avg(
      blocks.map(
        (b) =>
          (b.volumeTrend === "rising" ? 0.8 : 0.6) +
          (b.deloadDetected ? 0.2 : 0)
      )
    )
  );

  // Stress patterning: fewer spacing flags is better
  const stressPatterning = clamp01(
    avg(allWeeks.map((w) => 1 - Math.min(1, w.spacingFlags.length * 0.15)))
  );

  // Volume fit: auto band by goal; check priority muscles only
  const [minSet, maxSet] =
    DEFAULT_SET_BAND_BY_GOAL[
      spec.goal as keyof typeof DEFAULT_SET_BAND_BY_GOAL
    ];
  const volumeFit = clamp01(
    avg(
      priorityMusclesAuto.map((m) => {
        const v = weeklyAvgByMuscle[m] ?? 0;
        return v >= minSet && v <= maxSet ? 1 : 0;
      })
    )
  );

  // Intensity fit: use histogram if available, else role mix
  const hi = avg(
    allWeeks.map(
      (w) =>
        w.intensityHistogram?.high ??
        w.roles.filter((r) => r === "High").length / w.roles.length
    )
  );
  const mid = avg(
    allWeeks.map(
      (w) =>
        w.intensityHistogram?.moderate ??
        w.roles.filter((r) => r === "Medium").length / w.roles.length
    )
  );
  const lo = Math.max(0, 1 - hi - mid);

  const intensityFit =
    spec.goal === "strength"
      ? clamp01(0.5 + 0.5 * hi)
      : spec.goal === "hypertrophy"
      ? clamp01(0.5 + 0.5 * mid)
      : spec.goal === "endurance"
      ? clamp01(0.5 + 0.5 * lo)
      : clamp01(0.6);

  // Balance health: average of 3 ratios near 1.0
  const balanceHealth = clamp01(
    avg(
      allWeeks.map((w) => {
        const ratios = [
          w.balanceRatios.pushPull ?? 1,
          w.balanceRatios.quadHam ?? 1,
          w.balanceRatios.upperLower ?? 1,
        ];
        return (
          ratios
            .map((r) => 1 - Math.min(1, Math.abs(Math.log2(r))))
            .reduce((a, c) => a + c, 0) / 3
        );
      })
    )
  );

  // Feasibility: “recommended time” band by goal (no user input needed)
  const [recMin, recMax] =
    RECOMMENDED_MINUTES_BAND[
      spec.goal as keyof typeof RECOMMENDED_MINUTES_BAND
    ];
  const avgWeeklyMinutes = avg(allWeeks.map((w) => w.projectedWeeklyMinutes));
  const minutesFit = (() => {
    if (avgWeeklyMinutes >= recMin && avgWeeklyMinutes <= recMax) return 1;
    const mid = (recMin + recMax) / 2;
    const span = (recMax - recMin) / 2 || 1;
    return clamp01(1 - Math.abs(avgWeeklyMinutes - mid) / (span * 2)); // soft penalty outside band
  })();

  // Score (0..100)
  const goalFitScore = Math.round(
    100 *
      (weights.specificity * specificity +
        weights.progression * progression +
        weights.stressPatterning * stressPatterning +
        weights.volumeFit * volumeFit +
        weights.intensityFit * intensityFit +
        weights.balanceHealth * balanceHealth +
        weights.feasibility * minutesFit)
  );

  // Extra coachable metrics
  const sessionsPerWeek = avg(allWeeks.map((w) => w.roles.length));
  const avgSessionMinutes = avg(
    allWeeks.map((w) =>
      w.roles.length ? w.projectedWeeklyMinutes / w.roles.length : 0
    )
  );

  // Monotony / Strain (classic)
  const sessionLoads = allWeeks.flatMap((w) =>
    w.roles.map((r) => loadFromRole[r])
  );
  const mean = avg(sessionLoads);
  const sd = Math.sqrt(
    sessionLoads.reduce((a, c) => a + (c - mean) ** 2, 0) /
      Math.max(1, sessionLoads.length)
  );
  const monotony = sd ? mean / sd : 3;
  const strain = mean * monotony;

  // Top & low-attention muscles (per-week average)
  const topMuscles = Object.entries(weeklyAvgByMuscle)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const lowAttentionMuscles = Object.entries(weeklyAvgByMuscle)
    .filter(([, v]) => v > 0 && v < LOW_ATTENTION_THRESHOLD)
    .map(([m]) => m);

  // Insights (plain, friendly)
  const insights: string[] = [];
  if (goalFitScore >= 85) insights.push("Great alignment with your goal.");
  if (minutesFit < 0.8)
    insights.push("Weekly minutes are outside the recommended range.");
  if (monotony > 2.5)
    insights.push("Sessions feel very similar—consider more variation.");
  if (lowAttentionMuscles.length)
    insights.push("Some muscle groups get little attention.");

  return {
    goalFitScore,
    coverageHeatmap: weeklyAvgByMuscle, // now normalized to per-week averages
    insights,

    // NEW exports for ProgramMetrics
    recommendedMinutesBand: [recMin, recMax] as [number, number],
    avgWeeklyMinutes,
    minutesFit,
    sessionsPerWeek,
    avgSessionMinutes,
    monotony,
    strain,
    intensityMix: { high: hi, moderate: mid, low: lo },
    balanceAvg: {
      pushPull: avg(allWeeks.map((w) => w.balanceRatios.pushPull ?? 1)),
      quadHam: avg(allWeeks.map((w) => w.balanceRatios.quadHam ?? 1)),
      upperLower: avg(allWeeks.map((w) => w.balanceRatios.upperLower ?? 1)),
    },
    priorityMusclesAuto,
    topMuscles,
    lowAttentionMuscles,
  };
}
