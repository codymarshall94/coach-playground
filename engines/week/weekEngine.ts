/**
 * Week Engine — computeWeekFromSequence
 * ------------------------------------------------------------
 * Purpose:
 *   Project a “week” from a sequence of day metrics using intended
 *   sessions/week (no calendar). Produces stress strip, spacing flags,
 *   volume coverage, balance ratios, intensity mix, and a weekly score.
 *
 * Inputs:
 *   - cycle: DayMetrics[] for the sequence (slots)
 *   - intendedSessionsPerWeek: number of work slots to project
 *   - priorities/targets: optional goal-aware coverage checks
 *
 * Outputs:
 *   WeekMetrics for UI Weekly panel + higher-level engines.
 */

import {
  DayMetrics,
  ProgramSpec,
  WeekMetrics,
  WeeklyTargets,
} from "../core/types";
import { avg, stddev, zScore } from "../core/utils/math";
import { spacingFlagsForRoles } from "./spacing";
import { volumeByMuscleFromDays } from "./coverage";
import { balanceRatios } from "./balance";

export function computeWeekFromSequence(
  cycle: DayMetrics[],
  targets?: WeeklyTargets
): WeekMetrics {
  if (!cycle.length) {
    return {
      weekIndex: 0,
      roles: [],
      spacingFlags: ["Empty cycle"],
      volumeByMuscle: {},
      balanceRatios: {},
      intensityHistogram: { low: 0, moderate: 0, high: 0 },
      projectedWeeklyMinutes: 0,
      projectedWeeklyScore: 0,
    };
  }

  // Use first N slots as the projected “week”
  const N = Math.min(cycle.length);
  const projected = cycle.slice(0, N);

  // Normalize loads across projected window → High/Med/Low via z-score
  const loads = projected.map((d) => d.sessionLoad);
  const mean = avg(loads),
    sd = stddev(loads);
  const roles = projected.map((d) => {
    const z = zScore(d.sessionLoad, mean, sd);
    return z >= +0.5 ? "High" : z <= -0.5 ? "Low" : "Medium";
  });

  const spacingFlags = spacingFlagsForRoles(roles);
  const volumeByMuscle = volumeByMuscleFromDays(projected);
  const balances = balanceRatios(volumeByMuscle);

  // Intensity “histogram” proxy from roles (refine later with %1RM bins)
  const intensityHistogram = {
    low: roles.filter((r) => r === "Low").length / N,
    moderate: roles.filter((r) => r === "Medium").length / N,
    high: roles.filter((r) => r === "High").length / N,
  };

  const projectedWeeklyMinutes = projected.reduce(
    (a, d) => a + d.estDurationMin,
    0
  );

  // Simple weekly score: coverage vs targets × spacing penalty
  let coverageScore = 0.7;
  if (targets?.setsPerMuscle) {
    const mus = Object.keys(volumeByMuscle);
    const hits = mus.map((m) => {
      const got = volumeByMuscle[m] ?? 0;
      const [min, max] = targets.setsPerMuscle![m] ?? [0, Infinity];
      return got >= min && got <= max ? 1 : 0;
    });
    coverageScore = hits.length ? avg(hits) : 0.7;
  }
  const patternPenalty = spacingFlags.length
    ? Math.max(0, 1 - 0.15 * spacingFlags.length)
    : 1;
  const projectedWeeklyScore = Math.round(
    100 * Math.max(0, Math.min(1, coverageScore * patternPenalty))
  );

  return {
    weekIndex: 0,
    roles,
    spacingFlags,
    volumeByMuscle,
    balanceRatios: balances,
    intensityHistogram,
    projectedWeeklyMinutes,
    projectedWeeklyScore,
  };
}
