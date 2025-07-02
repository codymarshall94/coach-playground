import { MUSCLES } from "@/constants/muscles";
import { Exercise } from "@/types/Exercise";
import { WorkoutExercise } from "@/types/Workout";
import { WorkoutSummaryStats } from "@/types/WorkoutSummary";

// ───────────────────────────────────────────────
// Thresholds
const JOINT_STRESS_HIGH = 0.7;
const JOINT_STRESS_MODERATE = 0.4;
const REGION_DOMINANCE_THRESHOLD = 1.3;

// ───────────────────────────────────────────────
// Types

interface WorkoutAnalytics extends WorkoutSummaryStats {
  total_sets: number;
  total_fatigue: number;
  top_muscles: [string, number][];
  muscle_volumes: Record<string, number>;
  muscle_set_counts: Record<string, number>;
  category_counts: Record<string, number>;
  energy_system_counts: Record<string, number>;
  workout_type: string;
  injury_risk: "Low" | "Moderate" | "High";
  push_pull_ratio?: number;
  lower_upper_ratio?: number;
  overload_potential?: string;
}

// ───────────────────────────────────────────────
// Utility

const increment = (obj: Record<string, number>, key: string, by = 1) => {
  obj[key] = (obj[key] || 0) + by;
};

// ───────────────────────────────────────────────
// Helper Functions

function determineInjuryRisk(
  avgJoint: number
): WorkoutAnalytics["injury_risk"] {
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
  regionCount: Record<"upper" | "lower" | "core", number>,
  categoryCounts: Record<string, number>
): string {
  const regionLabel =
    regionCount.upper > regionCount.lower * REGION_DOMINANCE_THRESHOLD
      ? "Upper"
      : regionCount.lower > regionCount.upper * REGION_DOMINANCE_THRESHOLD
      ? "Lower"
      : regionCount.upper > 0 && regionCount.lower > 0
      ? "Full Body"
      : "Mixed";

  const dominantCategory =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Mixed";

  return `${regionLabel} ${dominantCategory
    .charAt(0)
    .toUpperCase()}${dominantCategory.slice(1)}`;
}

// ───────────────────────────────────────────────
// Main Analysis Function

export function analyzeWorkoutDay(
  workout: WorkoutExercise[],
  exercises: Exercise[]
): WorkoutAnalytics {
  const muscleVolumes: Record<string, number> = {};
  const muscleSetCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const energySystemCounts: Record<string, number> = {};
  const regionCount = { upper: 0, lower: 0, core: 0 };
  const movementCount = { push: 0, pull: 0, neutral: 0 };
  const activationTotals: Record<string, number> = {};

  let setCount = 0;
  let totalVolume = 0;
  let totalFatigue = 0;
  let totalRecovery = 0;
  let totalJointStress = 0;

  for (const workoutEx of workout) {
    const baseEx = exercises?.find((e) => e.id === workoutEx.id);
    if (!baseEx) continue;

    // ✅ Count once per exercise (not per set)
    increment(categoryCounts, baseEx.category);
    increment(energySystemCounts, baseEx.energy_system);

    const volumePerSet =
      (baseEx.volume_per_set_estimate?.strength +
        baseEx.volume_per_set_estimate?.hypertrophy) /
        2 || 0;

    for (const _set of workoutEx.sets) {
      setCount++;
      totalFatigue += baseEx.fatigue.index;
      totalRecovery += baseEx.recovery_days;
      totalJointStress += baseEx.fatigue.joint_stress;
      totalVolume += volumePerSet;

      for (const [muscleId, activation] of Object.entries(
        baseEx.activation_map
      )) {
        increment(muscleVolumes, muscleId, activation);
        increment(muscleSetCounts, muscleId);
        increment(activationTotals, muscleId, activation);

        const muscleMeta = MUSCLES.find((m) => m.id === muscleId);
        if (!muscleMeta) continue;

        increment(regionCount, muscleMeta.region, activation);
        increment(movementCount, muscleMeta.movementType, activation);
      }
    }
  }

  // Derived averages
  const avgRecovery = setCount ? totalRecovery / setCount : 0;
  const avgFatigue = setCount ? totalFatigue / setCount : 0;
  const avgJoint = setCount ? totalJointStress / setCount : 0;

  // Top muscles
  const topMuscles = Object.entries(activationTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const top_muscles = Object.entries(muscleVolumes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const workout_type = determineWorkoutType(regionCount, categoryCounts);
  const injury_risk = determineInjuryRisk(avgJoint);
  const push_pull_ratio = calculatePushPullRatio(
    movementCount.push,
    movementCount.pull
  );
  const lower_upper_ratio = calculateLowerUpperRatio(
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

    total_sets: setCount,
    total_fatigue: totalFatigue,
    top_muscles,
    muscle_volumes: muscleVolumes,
    muscle_set_counts: muscleSetCounts,
    category_counts: categoryCounts,
    energy_system_counts: energySystemCounts,
    workout_type,
    injury_risk,
    push_pull_ratio,
    lower_upper_ratio,
    overload_potential: undefined,
  };
}
