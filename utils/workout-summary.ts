import { EXERCISES } from "@/data/exercises";
import { WorkoutSummaryStats } from "@/types/WorkoutSummary";
import { Exercise } from "@/types/Workout";

export function calculateWorkoutSummary(
  exercises: Exercise[]
): WorkoutSummaryStats {
  const totalVolume = exercises.reduce(
    (sum, ex) =>
      sum +
      (ex.volumePerSetEstimate.strength + ex.volumePerSetEstimate.hypertrophy) /
        2,
    0
  );

  const avgFatigue =
    exercises.reduce((sum, ex) => sum + ex.fatigue.index, 0) /
      exercises.length || 0;
  const avgCNS =
    exercises.reduce((sum, ex) => sum + ex.fatigue.cnsDemand, 0) /
      exercises.length || 0;
  const avgMet =
    exercises.reduce((sum, ex) => sum + ex.fatigue.metabolicDemand, 0) /
      exercises.length || 0;
  const avgJoint =
    exercises.reduce((sum, ex) => sum + ex.fatigue.jointStress, 0) /
      exercises.length || 0;

  const systemBreakdown = exercises.reduce((acc, ex) => {
    acc[ex.energySystem] = (acc[ex.energySystem] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const allMuscleActivations: Record<string, number> = {};
  exercises.forEach((ex) => {
    Object.entries(ex.activationMap).forEach(([muscle, value]) => {
      allMuscleActivations[muscle] =
        (allMuscleActivations[muscle] || 0) + value;
    });
  });

  const topMuscles = Object.entries(allMuscleActivations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const movementFocus = exercises.reduce((acc, ex) => {
    acc[ex.category] = (acc[ex.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxRecovery = Math.max(...exercises.map((ex) => ex.recoveryDays));
  const avgRecovery =
    exercises.reduce((sum, ex) => sum + ex.recoveryDays, 0) /
      exercises.length || 0;

  return {
    totalVolume,
    avgFatigue,
    avgCNS,
    avgMet,
    avgJoint,
    systemBreakdown,
    topMuscles,
    movementFocus,
    maxRecovery,
    avgRecovery,
  };
}
