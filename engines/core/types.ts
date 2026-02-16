/**
 * PRGRM Engine — Core Types
 * ------------------------------------------------------------
 * Purpose:
 *   Central place for shared type definitions across all engines.
 *
 * Key Concepts:
 *   - This file must remain logic-free (types only).
 *   - Keeps import directions clean and prevents circular deps.
 *
 * Gotchas:
 *   - Update types here first when adding new metrics/engines.
 *   - Prefer narrow string unions over free-form strings.
 */

import { Exercise } from "@/types/Exercise";

export type Goal =
  | "strength"
  | "hypertrophy"
  | "athletic"
  | "fat_loss"
  | "endurance";
export type DayRole = "High" | "Medium" | "Low";

/** Movement categories used for balance / coverage */
export type MovementPattern =
  | "squat"
  | "hinge"
  | "horizontal_push"
  | "horizontal_pull"
  | "vertical_push"
  | "vertical_pull"
  | "carry"
  | "lunge"
  | "rotation"
  | "gait"
  | "core";

/** Energy system buckets (very coarse heuristic) */
export type EnergySystem = "ATP_CP" | "Glycolytic" | "Oxidative";

/** Supported set styles; extend as needed */
export type SetType =
  | "warmup"
  | "standard"
  | "amrap"
  | "drop"
  | "cluster"
  | "myo_reps"
  | "rest_pause"
  | "top_set"
  | "backoff";

/** A single set prescription (rep/rest/intensity) */
export type SetInfo = {
  reps: number;
  rest: number;
  rpe?: number | null;
  rir?: number | null;
  one_rep_max_percent?: number | null;
  set_type: SetType;

  drop_percent?: number;
  drop_sets?: number;

  cluster_reps?: number;
  intra_rest?: number;

  activation_set_reps?: number;

  mini_sets?: number;

  initial_reps?: number;
  pause_duration?: number;

  notes?: string;
};

/** An exercise appearing in a session with its sets and order */
export type SessionExercise = {
  exercise: Exercise;
  sets: SetInfo[];
  order: number;
};

/** Optional user-declared “intent” that can override computed values */
export type SessionIntent = {
  role_intent?: DayRole; // override High/Med/Low classification
  focus_muscles?: string[]; // tag muscles the user intends to focus
  focus_patterns?: MovementPattern[]; // tag movement patterns intended
  objective?: string; // short “why this day exists”
  density_intent?: "normal" | "short_rests";
};

/** A planned session “slot” in the sequence (calendar-free) */
export type SessionInput = {
  sessionId: string;
  slotIndex: number; // position in sequence (0-based)
  exercises: SessionExercise[];
  timeCapMin?: number;
  intent?: SessionIntent;
};

/** Coarse fatigue dimensions for explainability */
export type FatigueBreakdown = {
  cns: number;
  metabolic: number;
  joint: number;
};

/** Output of Day Engine (per-session metrics) */
export type DayMetrics = {
  sessionLoad: number; // normalized 0..10 scale
  rawLoad: number; // unbounded scalar (pre-normalization)
  estDurationMin: number;
  roleComputed: DayRole; // from math
  roleFinal: DayRole; // respects user override
  fatigue: FatigueBreakdown;
  energy: Record<EnergySystem, number>; // fractions sum ≈ 1
  muscleSets: Record<string, number>; // effective sets (weighted)
  muscleSetHits: Record<string, number>; // raw set counts
  patternExposure: Record<MovementPattern, number>;
  riskFlags: string[];
};

/** Optional per-goal targets for weekly evaluation */
export type WeeklyTargets = {
  setsPerMuscle?: Record<string, [number, number]>;
  percent1RMBand?: [number, number];
};

/** Output of Week Engine (projected from sequence + intended frequency) */
export type WeekMetrics = {
  weekIndex: number;
  roles: DayRole[];
  spacingFlags: string[];
  volumeByMuscle: Record<string, number>;
  balanceRatios: { pushPull?: number; quadHam?: number; upperLower?: number };
  intensityHistogram: { low: number; moderate: number; high: number };
  projectedWeeklyMinutes: number;
  projectedWeeklyScore: number; // 0..100
};

/** Output of Block Engine (trends + deload) */
export type BlockMetrics = {
  blockIndex: number;
  weekly: WeekMetrics[];
  volumeTrend: "rising" | "flat" | "falling";
  intensityTrend: "rising" | "flat" | "falling";
  deloadDetected: boolean;
  blockScore: number; // 0..100
};

/** User constraints steer feasibility and projections */
export type ProgramConstraints = {
  timeCapMin?: number;
  equipment?: string[];
  fatigueTolerance?: "low" | "med" | "high";
};

/** Program specification (the “north star” the engines aim at) */
export type ProgramSpec = {
  goal: Goal;
  targets?: WeeklyTargets;
  constraints?: ProgramConstraints;
};

/** Output of Program Engine (global fit + coverage) */
export type ProgramMetrics = {
  blocks: BlockMetrics[];
  goalFitScore: number; // 0..100
  coverageHeatmap: Record<string, number>;
  globalInsights: string[];
  recommendedMinutesBand: [number, number];
  avgWeeklyMinutes: number;
  minutesFit: number;
  sessionsPerWeek: number;
  avgSessionMinutes: number;
  monotony: number;
  strain: number;
  intensityMix: number;
  balanceAvg: number;
  priorityMusclesAuto: string[];
  topMuscles: string[];
  lowAttentionMuscles: string[];
};
