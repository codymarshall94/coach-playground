/**
 * Block Engine — computeBlockMetrics
 * ------------------------------------------------------------
 * Purpose:
 *   Summarize a block (several weeks) with trends, deload detection,
 *   and a block score (avg weekly score + small bonuses).
 *
 * Gotchas:
 *   - Deload: looks for ≥30% volume drop week-over-week.
 */

import { BlockMetrics, WeekMetrics } from "../core/types";
import { trend3 } from "./trends";

export function computeBlockMetrics(weeks: WeekMetrics[]): BlockMetrics {
  const blockIndex = 0;

  const vols = weeks.map((w) =>
    Object.values(w.volumeByMuscle).reduce((a, c) => a + c, 0)
  );
  const ints = weeks.map((w) => w.intensityHistogram.high);

  const volumeTrend = trend3(vols);
  const intensityTrend = trend3(ints);

  // Basic deload detection
  let deloadDetected = false;
  for (let i = 1; i < weeks.length; i++) {
    const drop = (vols[i - 1] - vols[i]) / Math.max(1, vols[i - 1]);
    if (drop >= 0.3) {
      deloadDetected = true;
      break;
    }
  }

  // Score = mean weekly score, with small bonuses for deload + rising volume
  let score =
    weeks.reduce((a, w) => a + w.projectedWeeklyScore, 0) /
    Math.max(1, weeks.length);
  if (deloadDetected) score = score + (100 - score) * 0.05;
  if (volumeTrend === "rising") score = score + (100 - score) * 0.03;

  return {
    blockIndex,
    weekly: weeks,
    volumeTrend,
    intensityTrend,
    deloadDetected,
    blockScore: Math.round(score),
  };
}
