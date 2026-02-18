/**
 * Program Engine — computeProgramMetrics
 * ------------------------------------------------------------
 * Purpose:
 *   Wrap scoring + package program-level outputs for the UI.
 */
import { BlockMetrics, ProgramMetrics, ProgramSpec } from "../core/types";
import { scoreProgram } from "./scoring";

export function computeProgramMetrics(
  spec: ProgramSpec,
  blocks: BlockMetrics[]
): ProgramMetrics {
  const s = scoreProgram(spec, blocks);
  return {
    blocks,
    goalFitScore: s.goalFitScore,
    subScores: s.subScores,
    coverageHeatmap: s.coverageHeatmap,
    globalInsights: s.insights,
    recommendedMinutesBand: s.recommendedMinutesBand,
    avgWeeklyMinutes: s.avgWeeklyMinutes,
    minutesFit: s.minutesFit,
    sessionsPerWeek: s.sessionsPerWeek,
    avgSessionMinutes: s.avgSessionMinutes,
    monotony: s.monotony,
    strain: s.strain,
    intensityMix: s.intensityMix,
    balanceAvg: s.balanceAvg,
    priorityMusclesAuto: s.priorityMusclesAuto,
    topMuscles: s.topMuscles.map(([muscle, _]) => muscle),
    lowAttentionMuscles: s.lowAttentionMuscles,
  };
}
