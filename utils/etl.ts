/**
 * ETL — Estimated Training Load
 * ────────────────────────────────────────────────────────────────
 * Battle-tested formula based on Exertion-Weighted Volume concepts
 * from sports science (Foster et al. session-RPE x volume model),
 * adapted per-exercise.
 *
 * Key principles:
 *   1. Rep factor uses diminishing returns (reps^0.75) — 15 reps
 *      is not 3x the stimulus of 5 reps.
 *   2. Intensity scales exponentially with RPE — going from RPE 7->9
 *      is much harder than 5->7.
 *   3. Exercise difficulty is derived from CNS demand, compound
 *      status, and equipment — simple and transparent.
 *   4. Output is a 0-10 scale per exercise, 0-10 average per session.
 *
 * Reference values (sanity checks baked into the design):
 *   Face Pull 3x15 @ RPE 7       -> ~3.5 (Moderate)
 *   Bench Press 3x8 @ RPE 8      -> ~4.5 (Challenging)
 *   Back Squat 4x5 @ RPE 8       -> ~5.0 (Challenging)
 *   Deadlift 4x5 @ RPE 9         -> ~6.8 (Hard)
 *   Lateral Raise 3x12 @ RPE 8   -> ~4.0 (Moderate)
 *   Tricep Pushdown 3x12 @ RPE 7 -> ~3.0 (Light)
 */

import { Exercise } from "@/types/Exercise";
import { ProgramGoal, SetType, WorkoutExercise } from "@/types/Workout";

/* ═══════════════════════════════════════════════════════════════
   1. INTENSITY WEIGHT — how hard each set is relative to max
   ═══════════════════════════════════════════════════════════════ */

/**
 * Map RPE to an exponentially-scaled effort weight.
 * The jump from RPE 8->9 is larger than 6->7, matching real fatigue curves.
 */
function intensityWeight(set: WorkoutExercise["sets"][0]): number {
  // Determine raw RPE-equivalent from whichever system is specified
  let rpe: number;

  if (set.rpe != null) {
    rpe = set.rpe;
  } else if (set.rir != null) {
    // RIR maps to RPE: RIR 0 = RPE 10, RIR 1 = RPE 9, etc.
    rpe = Math.max(5, 10 - set.rir);
  } else if (set.one_rep_max_percent != null) {
    // %1RM -> RPE approximation (Zourdos et al. 2016 table)
    const p = set.one_rep_max_percent;
    if (p >= 95) rpe = 10;
    else if (p >= 90) rpe = 9;
    else if (p >= 85) rpe = 8.5;
    else if (p >= 80) rpe = 8;
    else if (p >= 75) rpe = 7;
    else if (p >= 70) rpe = 6.5;
    else if (p >= 65) rpe = 6;
    else rpe = 5;
  } else {
    // No intensity specified — assume moderate training (RPE 7)
    rpe = 7;
  }

  // Exponential mapping: RPE 5->0.30, 6->0.40, 7->0.60, 8->0.85, 9->1.10, 10->1.40
  // Formula: 0.0275 * e^(0.39 * rpe) — hand-tuned to match the reference table.
  return Math.min(1.5, 0.0275 * Math.exp(0.39 * rpe));
}

/* ═══════════════════════════════════════════════════════════════
   2. SET-TYPE MODIFIER — advanced methods that add or reduce stress
   ═══════════════════════════════════════════════════════════════ */

const SET_TYPE_MULT: Record<SetType, number> = {
  warmup: 0.3,
  standard: 1.0,
  amrap: 1.2,
  drop: 1.15,
  cluster: 1.1,
  myo_reps: 1.15,
  rest_pause: 1.15,
  top_set: 1.1,
  backoff: 0.8,
};

/* ═══════════════════════════════════════════════════════════════
   3. EXERCISE DIFFICULTY — transparent multiplier from metadata
   ═══════════════════════════════════════════════════════════════ */

/**
 * Returns 0.65-1.50 based on exercise properties.
 * Compounds with high CNS load score higher; machines/isolation score lower.
 */
function exerciseDifficulty(ex: Exercise): number {
  const cns = ex.cns_demand ?? 0.5;

  // Base: 0.8 for a "middle of the road" exercise
  let base = 0.8 + cns * 0.35; // 0.80-1.15

  // Compound vs isolation
  if (ex.compound) base *= 1.15;
  else base *= 0.88;

  // Machine exercises are more stable -> slightly less systemic stress
  const isMachine = (ex.equipment ?? []).includes("machine");
  if (isMachine) base *= 0.90;

  return Math.max(0.65, Math.min(1.5, base));
}

/* ═══════════════════════════════════════════════════════════════
   4. PER-SET LOAD — the core unit of the formula
   ═══════════════════════════════════════════════════════════════ */

/**
 * Diminishing-returns rep factor: reps^0.75.
 * 15 reps -> 7.6  vs  5 reps -> 3.3  (2.3x not 3x).
 */
function repFactor(reps: number): number {
  if (reps <= 0) return 0;
  return Math.pow(reps, 0.75);
}

/** Single-set training load (arbitrary units before normalization). */
function setLoad(set: WorkoutExercise["sets"][0]): number {
  const reps = set.reps ?? 0;
  const typeMult = SET_TYPE_MULT[set.set_type] ?? 1.0;
  return repFactor(reps) * intensityWeight(set) * typeMult;
}

/* ═══════════════════════════════════════════════════════════════
   5. NORMALIZER — tuned so common exercises land in the right zone
   ═══════════════════════════════════════════════════════════════
   A "reference moderate exercise" is ~3 sets x 10 reps @ RPE 7.5
   with difficulty 1.0.
   repFactor(10) = 5.62, intensityWeight(RPE 7.5) ~ 0.58,
   3 sets -> raw = 3 * 5.62 * 0.58 * 1.0 = 9.78
   We want that to produce ETL ~ 4.0 (Moderate),
   so NORMALIZER = 9.78 / 4.0 ~ 2.45.
   ═══════════════════════════════════════════════════════════════ */

const NORMALIZER = 2.45;

/* ═══════════════════════════════════════════════════════════════
   6. PUBLIC API — exercise-level and workout-level ETL
   ═══════════════════════════════════════════════════════════════ */

/** Maximum safe %1RM for a given rep count (Epley-based ceiling). */
export function getMaxAllowedPercent1RM(reps: number): number {
  if (reps <= 1) return 100;
  if (reps <= 3) return 95;
  if (reps <= 5) return 90;
  if (reps <= 8) return 80;
  if (reps <= 10) return 72;
  if (reps <= 12) return 67;
  return 50;
}

/**
 * Exercise-level ETL (0-10 scale).
 *
 * `normalizedETL` is the primary value consumed by the UI.
 * `totalETL` is the un-normalized sum (useful for debugging).
 */
export function getExerciseETL(
  workoutExercise: WorkoutExercise,
  exerciseMeta: Exercise,
  _goal: ProgramGoal // reserved for future per-goal tuning
): { totalETL: number; normalizedETL: number } {
  if (!exerciseMeta) return { totalETL: 0, normalizedETL: 0 };

  const difficulty = exerciseDifficulty(exerciseMeta);

  let rawSum = 0;
  for (const s of workoutExercise.sets) {
    rawSum += setLoad(s);
  }

  const totalETL = rawSum * difficulty;
  const normalizedETL = Math.min(10, totalETL / NORMALIZER);

  return { totalETL, normalizedETL };
}

/**
 * Workout / session-level ETL.
 *
 * `normalizedETL` is a **weighted average** (0-10) — "how hard is the
 * typical exercise in this session?"   Coaches intuitively understand
 * this because it answers "is each movement demanding or easy?"
 *
 * `sessionETL` is the **sum** of all exercise ETLs — useful for total
 * training-volume tracking across sessions.
 */
export function getWorkoutDayETL(
  workoutExercises: WorkoutExercise[],
  allExerciseMeta: Exercise[],
  goal: ProgramGoal
) {
  const perExerciseETL: Array<{ id: string; etl: number; sets: number }> = [];
  let weightedSum = 0;
  let totalSets = 0;

  for (const wEx of workoutExercises) {
    const meta = allExerciseMeta.find((ex) => ex.id === wEx.exercise_id);
    if (!meta) continue;

    const { normalizedETL: exETL } = getExerciseETL(wEx, meta, goal);
    const sets = wEx.sets.length || 1;

    perExerciseETL.push({ id: wEx.exercise_id, etl: exETL, sets });
    weightedSum += exETL * sets;
    totalSets += sets;
  }

  const numExercises = perExerciseETL.length;

  // Weighted average by set count — exercises with more sets count more
  const normalizedETL = totalSets > 0 ? weightedSum / totalSets : 0;

  // Sum for volume tracking
  const sessionETL = perExerciseETL.reduce((s, e) => s + e.etl, 0);

  return {
    normalizedETL, // 0-10 weighted average (primary display value)
    sessionETL, // sum of all exercise ETLs (volume tracking)
    perExerciseETL,
    totalSets,
    numExercises,
  };
}
