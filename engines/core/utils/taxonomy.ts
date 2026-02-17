/**
 * PRGRM Engine — Taxonomy Helpers
 * ------------------------------------------------------------
 * Purpose:
 *   Helpers that understand your muscle taxonomy to compute ratios.
 *
 * Gotchas:
 *   - Keep MUSCLE_GROUPS in constants synced with your exercise DB.
 */

import { MUSCLE_GROUPS } from "../constants";

export const sumMuscles = (
  volumeByMuscle: Record<string, number>,
  ids: string[]
) => ids.reduce((acc, m) => acc + (volumeByMuscle[m] ?? 0), 0);

export const pushPullRatio = (v: Record<string, number>) =>
  (sumMuscles(v, MUSCLE_GROUPS.push) || 1) /
  (sumMuscles(v, MUSCLE_GROUPS.pull) || 1);

export const quadHamRatio = (v: Record<string, number>) =>
  (sumMuscles(v, MUSCLE_GROUPS.quads) || 1) /
  (sumMuscles(v, MUSCLE_GROUPS.hams) || 1);

export const upperLowerRatio = (v: Record<string, number>) =>
  (sumMuscles(v, MUSCLE_GROUPS.upper) || 1) /
  (sumMuscles(v, MUSCLE_GROUPS.lower) || 1);
