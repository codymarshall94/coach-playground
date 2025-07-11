import { Exercise } from "@/types/Exercise";
import { WorkoutExercise } from "@/types/Workout";

function getDifficultyMultiplier(exercise: Exercise): number {
  const cns = exercise.cns_demand ?? 0.5;
  const metabolic = exercise.metabolic_demand ?? 0.5;
  const joint = exercise.joint_stress ?? 0.5;
  const skill = exercise.skill_requirement;
  const rom = exercise.rom_rating;

  const activationTotal = Object.values(exercise.activation_map ?? {}).reduce(
    (sum, val) => sum + val,
    0
  );

  const romFactor = rom === "long" ? 1.1 : rom === "short" ? 0.9 : 1.0;
  const skillFactor = skill === "high" ? 1.15 : skill === "low" ? 0.85 : 1.0;
  const isMachine = exercise.equipment.includes("machine");
  const machinePenalty = isMachine ? 0.8 : 1;
  const compoundBonus = exercise.compound ? 1.2 : 0.9;

  const base =
    1 + 0.3 * cns + 0.2 * metabolic + 0.1 * joint + 0.05 * activationTotal;

  const scaled =
    base * romFactor * skillFactor * compoundBonus * machinePenalty;

  return Math.min(Math.max(scaled, 0.5), 2.5);
}

function estimateIntensityFromRPE(rpe: number): number {
  if (rpe >= 10) return 1.0;
  if (rpe >= 9.5) return 0.95;
  if (rpe >= 9) return 0.9;
  if (rpe >= 8) return 0.8;
  if (rpe >= 7) return 0.7;
  if (rpe >= 6) return 0.6;
  return 0.5;
}

export function getMaxAllowedPercent1RM(reps: number): number {
  if (reps <= 1) return 100;
  if (reps <= 3) return 95;
  if (reps <= 5) return 90;
  if (reps <= 8) return 80;
  if (reps <= 10) return 72;
  if (reps <= 12) return 67;
  return 50;
}

function clampPercent1RMToRepCeiling(
  reps: number,
  inputPercent: number
): number {
  const maxAllowed = getMaxAllowedPercent1RM(reps);
  if (inputPercent > maxAllowed) {
    console.warn(
      `⚠️ ${reps} reps at ${inputPercent}% 1RM exceeds safe ceiling (${maxAllowed}%). Clamped.`
    );
  }
  return Math.min(inputPercent, maxAllowed);
}

function getIntensityFromSet(set: WorkoutExercise["sets"][0]): number {
  const reps = set.reps ?? 10;

  if (set.one_rep_max_percent != null) {
    const capped = clampPercent1RMToRepCeiling(reps, set.one_rep_max_percent);
    return capped / 100;
  }

  if (set.rir != null) {
    if (set.rir <= 0) return 1.0;
    if (set.rir === 1) return 0.95;
    if (set.rir === 2) return 0.9;
    if (set.rir === 3) return 0.85;
    return 0.75;
  }

  if (set.rpe != null) return estimateIntensityFromRPE(set.rpe);

  return 0.7;
}

export function getExerciseETL(
  workoutExercise: WorkoutExercise,
  exerciseMeta: Exercise,
  goal: "strength" | "hypertrophy" = "hypertrophy"
): { totalETL: number; normalizedETL: number } {
  if (!exerciseMeta || typeof exerciseMeta.fatigue_index !== "number") {
    console.warn("⚠️ Missing or malformed exerciseMeta", workoutExercise);
    return { totalETL: 0, normalizedETL: 0 };
  }

  const fatigue = exerciseMeta.fatigue_index;
  const baseVolumePerSet = exerciseMeta.volume_per_set?.[goal] ?? 10;
  const difficulty = getDifficultyMultiplier(exerciseMeta);

  let totalETL = 0;

  for (let i = 0; i < workoutExercise.sets.length; i++) {
    const set = workoutExercise.sets[i];
    const reps = set.reps ?? 0;
    const intensity = getIntensityFromSet(set);
    const decay = 1 - i * 0.05;

    totalETL +=
      reps * intensity * fatigue * baseVolumePerSet * difficulty * decay;
  }

  return {
    totalETL,
    normalizedETL: totalETL / 100,
  };
}

export function getWorkoutETL(
  workoutExercises: WorkoutExercise[],
  allExerciseMeta: Exercise[],
  goal: "strength" | "hypertrophy" = "hypertrophy"
): { totalETL: number; normalizedETL: number } {
  return workoutExercises.reduce(
    (acc, wEx) => {
      const meta = allExerciseMeta.find((ex) => ex.id === wEx.exercise_id);
      if (!meta) return acc;
      const etl = getExerciseETL(wEx, meta, goal);
      return {
        totalETL: acc.totalETL + etl.totalETL,
        normalizedETL: acc.normalizedETL + etl.normalizedETL,
      };
    },
    { totalETL: 0, normalizedETL: 0 }
  );
}
