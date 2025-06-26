import { MUSCLES } from "@/constants/muscles";
import { EXERCISES } from "@/data/exercises";
import { WorkoutExercise } from "@/types/Workout";

interface Insights {
  total_sets: number;
  total_fatigue: number;
  avg_recovery: number;
  top_muscles: [string, number][];
  muscle_volumes: Record<string, number>;
  muscle_set_counts: Record<string, number>;
  category_counts: Record<string, number>;
  energy_system_counts: Record<string, number>;
  workout_type: string;
  injury_risk: "Low" | "Moderate" | "High";
  push_pull_balance?: string;
  push_pull_ratio?: number;
  lower_upper_ratio?: number;
  overload_potential?: string;
}

export function getWorkoutInsights(workout: WorkoutExercise[]): Insights {
  const muscleVolumes: Record<string, number> = {};
  const muscleSetCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const energySystemCounts: Record<string, number> = {};

  let totalFatigue = 0;
  let totalRecovery = 0;
  let totalJointStress = 0;
  let setCount = 0;

  const regionCount = { upper: 0, lower: 0, core: 0 };
  const movementCount = { push: 0, pull: 0, neutral: 0 };

  for (const exercise of workout) {
    const data = EXERCISES.find((e) => e.id === exercise.id);
    if (!data) continue;

    for (const _set of exercise.sets) {
      totalFatigue += data.fatigue.index;
      totalRecovery += data.recoveryDays;
      totalJointStress += data.fatigue.jointStress || 0;
      setCount++;

      categoryCounts[data.category] = (categoryCounts[data.category] || 0) + 1;
      energySystemCounts[data.energySystem] =
        (energySystemCounts[data.energySystem] || 0) + 1;

      for (const [muscleId, activation] of Object.entries(data.activationMap)) {
        muscleVolumes[muscleId] = (muscleVolumes[muscleId] || 0) + activation;
        muscleSetCounts[muscleId] = (muscleSetCounts[muscleId] || 0) + 1;

        const muscleMeta = MUSCLES.find((m) => m.id === muscleId);
        if (!muscleMeta) continue;

        regionCount[muscleMeta.region] += activation;
        movementCount[muscleMeta.movementType] += activation;
      }
    }
  }

  const sortedMuscles = Object.entries(muscleVolumes).sort(
    (a, b) => b[1] - a[1]
  );
  const topMuscles = sortedMuscles.slice(0, 5);
  const avgRecovery = setCount > 0 ? totalRecovery / setCount : 0;

  const injuryRisk: Insights["injury_risk"] =
    totalJointStress / setCount > 0.7
      ? "High"
      : totalJointStress / setCount > 0.4
      ? "Moderate"
      : "Low";

  const pushPullRatio =
    movementCount.pull > 0
      ? movementCount.push / movementCount.pull
      : movementCount.push;

  const lowerUpperRatio =
    regionCount.upper > 0 && regionCount.lower > 0
      ? regionCount.upper / regionCount.lower
      : 1;

  const dominantCategory =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Mixed";

  const regionLabel =
    regionCount.upper > regionCount.lower * 1.3
      ? "Upper"
      : regionCount.lower > regionCount.upper * 1.3
      ? "Lower"
      : regionCount.upper > 0 && regionCount.lower > 0
      ? "Full Body"
      : "Mixed";

  const workout_type =
    regionLabel +
    " " +
    dominantCategory.charAt(0).toUpperCase() +
    dominantCategory.slice(1);

  return {
    total_sets: setCount,
    total_fatigue: totalFatigue,
    avg_recovery: avgRecovery,
    top_muscles: topMuscles,
    muscle_volumes: muscleVolumes,
    muscle_set_counts: muscleSetCounts,
    category_counts: categoryCounts,
    energy_system_counts: energySystemCounts,
    workout_type,
    injury_risk: injuryRisk,

    push_pull_ratio: pushPullRatio,
    lower_upper_ratio: lowerUpperRatio,
    overload_potential: undefined,
  };
}
