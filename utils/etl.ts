import { Exercise } from "@/types/Exercise";
import { ProgramGoal, SetType, WorkoutExercise } from "@/types/Workout";

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

  // Base values: CNS and compound-ness weigh more
  const base =
    1 +
    0.5 * cns + // CNS demand drives more of the score
    0.3 * metabolic +
    0.15 * joint +
    0.05 * activationTotal;

  const romFactor = rom === "long" ? 1.1 : rom === "short" ? 0.9 : 1.0;
  const skillFactor = skill === "high" ? 1.05 : skill === "low" ? 0.95 : 1.0;

  const isMachine = exercise.equipment.includes("machine");
  const machinePenalty = isMachine ? 0.85 : 1;
  const compoundBonus = exercise.compound ? 1.25 : 0.85;

  // Clamp tighter so extremes aren’t ridiculous
  const scaled =
    base * romFactor * skillFactor * compoundBonus * machinePenalty;

  return Math.min(Math.max(scaled, 0.7), 2.0);
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
      `${reps} reps at ${inputPercent}% 1RM exceeds safe ceiling (${maxAllowed}%). Clamped.`
    );
  }
  return Math.min(inputPercent, maxAllowed);
}

function getIntensityFromSet(set: WorkoutExercise["sets"][0]): number {
  const reps = set.reps ?? 10;

  let rawIntensity: number;

  if (set.one_rep_max_percent != null) {
    const capped = clampPercent1RMToRepCeiling(reps, set.one_rep_max_percent);
    rawIntensity = capped / 100;
  } else if (set.rir != null) {
    if (set.rir <= 0) rawIntensity = 1.0;
    else if (set.rir === 1) rawIntensity = 0.95;
    else if (set.rir === 2) rawIntensity = 0.9;
    else if (set.rir === 3) rawIntensity = 0.85;
    else rawIntensity = 0.75;
  } else if (set.rpe != null) {
    rawIntensity = estimateIntensityFromRPE(set.rpe);
  } else {
    rawIntensity = 0.7;
  }

  // NEW: dampen very high intensity to avoid absurd ETL spikes
  if (reps <= 3 && rawIntensity > 0.9) {
    return 0.9 + (rawIntensity - 0.9) * 0.5; // halves the excess above 0.9
  }

  return rawIntensity;
}

const setTypeMultiplierMap: Record<SetType, number> = {
  warmup: 0.4,
  standard: 1.0,
  amrap: 1.2,
  drop: 1.1,
  cluster: 1.15,
  myo_reps: 1.05,
  rest_pause: 1.05,
  top_set: 1.1,
  backoff: 0.9,
};

export function getExerciseETL(
  workoutExercise: WorkoutExercise,
  exerciseMeta: Exercise,
  goal: ProgramGoal
): { totalETL: number; normalizedETL: number } {
  if (!exerciseMeta || typeof exerciseMeta.fatigue_index !== "number") {
    return { totalETL: 0, normalizedETL: 0 };
  }

  const fatigue = exerciseMeta.fatigue_index;
  const baseVolumePerSet =
    exerciseMeta.volume_per_set?.[
      goal as keyof typeof exerciseMeta.volume_per_set
    ] ?? 10;
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

type DayLoad = {
  // “How hard was today?” headline options
  meanPerExercise: number; // average of exercise ETL
  medianPerExercise: number; // median of exercise ETL (robust)
  trimmedMeanPerExercise: number; // drop top/bottom 10%, average middle
  avgPerSet: number; // totalETL / totalSets

  totalETL: number; // raw sum (for auditing/charts)
  normalizedETL: number; // totalETL / 100 (your existing convention)
  perExerciseETL: Array<{ id: string; etl: number; sets: number }>;
  totalSets: number;
  numExercises: number;
};

function trimmedMean(nums: number[], trimPct = 0.1): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const k = Math.floor(sorted.length * trimPct);
  const slice = sorted.slice(k, sorted.length - k || undefined);
  const sum = slice.reduce((s, v) => s + v, 0);
  return sum / slice.length;
}

export function getWorkoutDayETL(
  workoutExercises: WorkoutExercise[],
  allExerciseMeta: Exercise[],
  goal: ProgramGoal
) {
  const perExerciseETL: Array<{ id: string; etl: number; sets: number }> = [];
  let totalETL = 0;
  let totalSets = 0;

  for (const wEx of workoutExercises) {
    const meta = allExerciseMeta.find((ex) => ex.id === wEx.exercise_id);
    if (!meta) continue;

    const { totalETL: exETL } = getExerciseETL(wEx, meta, goal);
    const sets = wEx.sets.length || 0;

    perExerciseETL.push({ id: wEx.exercise_id, etl: exETL, sets });
    totalETL += exETL;
    totalSets += sets;
  }

  const exerciseETLs = perExerciseETL.map((e) => e.etl);
  const numExercises = exerciseETLs.length;

  const meanPerExercise = numExercises
    ? exerciseETLs.reduce((s, v) => s + v, 0) / numExercises
    : 0;

  const medianPerExercise = (() => {
    if (!numExercises) return 0;
    const sorted = [...exerciseETLs].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  })();

  const trimmedMeanPerExercise = trimmedMean(exerciseETLs, 0.1);
  const avgPerSet = totalSets ? totalETL / totalSets : 0;

  return {
    meanPerExercise,
    medianPerExercise,
    trimmedMeanPerExercise,
    avgPerSet,

    totalETL,
    normalizedETL: totalETL / 100, // sum-based
    normalizedETL_avg: meanPerExercise / 100, // average-based

    perExerciseETL,
    totalSets,
    numExercises,
  };
}
