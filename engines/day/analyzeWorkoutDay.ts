/**
 * Day Engine — Raw Workout Day Analysis
 * ------------------------------------------------------------
 * Purpose:
 *   Analyze raw workout day data (exercise groups + exercise catalog)
 *   without requiring the full SessionInput pipeline. Useful for
 *   quick per-day summaries in block/calendar views.
 *
 * This is the canonical location for per-day workout aggregation.
 * All analysis should live under engines/ — never in utils/.
 */

import { EnergySystem, Exercise, ExerciseCategory } from "@/types/Exercise";
import { WorkoutExerciseGroup, WorkoutTypes } from "@/types/Workout";

// ───────────────────────────────────────────────
// Thresholds

const JOINT_STRESS_HIGH = 0.7;
const JOINT_STRESS_MODERATE = 0.4;
const REGION_DOMINANCE_THRESHOLD = 1.3;

// ───────────────────────────────────────────────
// Types

/** Flat summary stats for a single workout day. */
export interface WorkoutDaySummary {
  totalVolume: number;
  avgFatigue: number;
  avgCNS: number;
  avgMet: number;
  avgJoint: number;
  systemBreakdown: Record<string, number>;
  topMuscles: [string, number][];
  movementFocus: Record<string, number>;
  maxRecovery: number;
  avgRecovery: number;
  totalSets: number;
  totalFatigue: number;
  muscleVolumes: Record<string, number>;
  muscleSetCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  energySystemCounts: Record<string, number>;
  workoutType: WorkoutTypes;
  injuryRisk: "Low" | "Moderate" | "High";
  pushPullRatio?: number;
  lowerUpperRatio?: number;
}

// ───────────────────────────────────────────────
// Utilities

const increment = (obj: Record<string, number>, key: string, by = 1) => {
  obj[key] = (obj[key] || 0) + by;
};

function determineInjuryRisk(
  avgJoint: number
): WorkoutDaySummary["injuryRisk"] {
  if (avgJoint > JOINT_STRESS_HIGH) return "High";
  if (avgJoint > JOINT_STRESS_MODERATE) return "Moderate";
  return "Low";
}

function calculatePushPullRatio(push: number, pull: number): number {
  return pull > 0 ? push / pull : push;
}

function calculateLowerUpperRatio(upper: number, lower: number): number {
  return upper > 0 && lower > 0 ? upper / lower : 1;
}

function determineWorkoutType(
  regionCount: Record<"upper" | "lower" | "core", number>
): WorkoutTypes {
  const regionLabel =
    regionCount.upper > regionCount.lower * REGION_DOMINANCE_THRESHOLD
      ? "Upper"
      : regionCount.lower > regionCount.upper * REGION_DOMINANCE_THRESHOLD
        ? "Lower"
        : regionCount.upper > 0 && regionCount.lower > 0
          ? "Full Body"
          : "Mixed";

  return regionLabel as WorkoutTypes;
}

// ───────────────────────────────────────────────
// Main Analysis Function

/**
 * Analyze a workout day from raw exercise groups + exercise catalog.
 * Returns a flat summary with volumes, fatigue, balance ratios, etc.
 */
export function analyzeWorkoutDay(
  exerciseGroups: WorkoutExerciseGroup[],
  exercises: Exercise[]
): WorkoutDaySummary {
  const muscleVolumes: Record<string, number> = {};
  const muscleSetCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const energySystemCounts: Record<string, number> = {};
  const regionCount = { upper: 0, lower: 0, core: 0 };
  const movementCount = { push: 0, pull: 0, neutral: 0, abduction: 0 };
  const activationTotals: Record<string, number> = {};

  let setCount = 0;
  let totalVolume = 0;
  let totalFatigue = 0;
  let totalRecovery = 0;
  let totalJointStress = 0;

  for (const workoutEx of exerciseGroups.flatMap((g) => g.exercises)) {
    const baseEx = exercises?.find((e) => e.id === workoutEx.exercise_id);
    if (!baseEx) continue;

    // Count once per exercise (not per set)
    increment(categoryCounts, baseEx.category);
    increment(energySystemCounts, baseEx.energy_system);

    const volumePerSet =
      (baseEx.volume_per_set?.strength + baseEx.volume_per_set?.hypertrophy) /
        2 || 0;

    for (const _set of workoutEx.sets) {
      setCount++;
      totalFatigue += baseEx.fatigue_index;
      totalRecovery += baseEx.recovery_days;
      totalJointStress += baseEx.joint_stress;
      totalVolume += volumePerSet;

      for (const muscle of baseEx.exercise_muscles ?? []) {
        const muscleId = muscle.muscles.id;
        const activation = muscle.contribution;

        increment(muscleVolumes, muscleId, activation);
        increment(muscleSetCounts, muscleId);
        increment(activationTotals, muscleId, activation);

        increment(regionCount, muscle.muscles.region, activation);
        increment(movementCount, muscle.muscles.movement_type, activation);
      }
    }
  }

  // Derived averages
  const avgRecovery = setCount ? totalRecovery / setCount : 0;
  const avgFatigue = setCount ? totalFatigue / setCount : 0;
  const avgJoint = setCount ? totalJointStress / setCount : 0;

  // Top muscles by activation
  const topMuscles = Object.entries(activationTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const workoutType = determineWorkoutType(regionCount);
  const injuryRisk = determineInjuryRisk(avgJoint);
  const pushPullRatio = calculatePushPullRatio(
    movementCount.push,
    movementCount.pull
  );
  const lowerUpperRatio = calculateLowerUpperRatio(
    regionCount.upper,
    regionCount.lower
  );

  return {
    totalVolume,
    avgFatigue,
    avgCNS: avgFatigue,
    avgMet: avgFatigue,
    avgJoint,
    systemBreakdown: energySystemCounts,
    topMuscles,
    movementFocus: categoryCounts,
    maxRecovery: avgRecovery,
    avgRecovery,
    totalSets: setCount,
    totalFatigue,
    muscleVolumes,
    muscleSetCounts,
    categoryCounts,
    energySystemCounts,
    workoutType,
    injuryRisk,
    pushPullRatio,
    lowerUpperRatio,
  };
}
