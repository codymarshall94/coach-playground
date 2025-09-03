/**
 * Program Goal Profiles — Types
 * Purpose:
 *  Define the shape for goal-specific presets used by scoring,
 *  coach nudges, and UI defaults when a user chooses a goal.
 *
 * How it's used:
 *  - When creating a ProgramSpec, the UI pulls a profile to prefill targets.
 *  - The scoring engine may override default weights with profile.weights.
 *  - Coach nudges can read thresholds (intensity/spacing/balance) per goal.
 */

import type { Goal, WeeklyTargets, ProgramSpec } from "../../core/types";

export type RoleMix = { high: number; medium: number; low: number }; // fractions sum ~1

export type IntensityTargets = {
  /** Preferred share of sessions by intensity bucket (fractions, sum ~1) */
  desired?: { high?: number; moderate?: number; low?: number };
  /** Minimum floors for certain buckets (e.g., strength needs some high) */
  minimums?: { high?: number; moderate?: number; low?: number };
  /** Maximum caps (e.g., avoid too many High days) */
  maximums?: { high?: number; moderate?: number; low?: number };
};

export type SpacingPolicy = {
  /** e.g., <=2 High in any 3 consecutive work sessions */
  maxHighIn3?: number;
  /** forbid adjacencies like High→High (if true, flag) */
  forbidHHAdjacent?: boolean;
};

export type BalanceBounds = {
  pushPull?: [number, number]; // ideal ≈ 1.0
  quadHam?: [number, number]; // ideal ≈ 1.0
  upperLower?: [number, number]; // ideal ≈ 1.0
};

export type ProfileCopy = {
  label: string; // short name for UI chips
  overview: string; // 1-2 sentence description
  coachingTone?: "gentle" | "direct";
};

export type GoalProfile = {
  id: Goal;
  copy: ProfileCopy;

  /** Partial override of global GOAL_WEIGHTS for program scoring */
  weights?: Partial<{
    specificity: number;
    progression: number;
    stressPatterning: number;
    volumeFit: number;
    intensityFit: number;
    balanceHealth: number;
    feasibility: number;
  }>;

  /** If the user picks priority muscles but no explicit targets, use this band */
  defaultTargetBandForPriorityMuscle?: [minSets: number, maxSets: number];

  /** Optional explicit weekly targets (by muscle id) if you embed presets */
  weeklyTargets?: WeeklyTargets;

  /** Preferred day-role distribution for planning UIs (not hard enforcement) */
  roleMix?: RoleMix;

  /** Intensity mix preferences & safety caps (used by coach/scoring hints) */
  intensity?: IntensityTargets;

  /** Spacing constraints for this goal */
  spacing?: SpacingPolicy;

  /** Balance ratio bounds for this goal */
  balance?: BalanceBounds;

  /** Helper to materialize targets from a ProgramSpec (e.g., apply one band to all priorities) */
  makeTargetsFromSpec?(spec: ProgramSpec): WeeklyTargets | undefined;
};
