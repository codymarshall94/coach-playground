// score.ts
// Scoring + hints for Workouts and Programs (days/blocks).
// All scores are 0–100. Return shaped data + brief hints for UI.

import type {
  Program,
  ProgramDay,
  ProgramGoal,
  Workout,
  WorkoutExercise,
  WorkoutExerciseGroup,
} from "@/types/Workout";
import {
  Exercise,
  ExerciseCategory,
  ExerciseMuscleJoined,
  EnergySystem,
} from "@/types/Exercise";

/* =========================
     Tunable constants
     ========================= */

const TARGET_SETS_PER_MUSCLE: Record<
  ProgramGoal,
  { min: number; max: number }
> = {
  hypertrophy: { min: 10, max: 20 }, // /week
  strength: { min: 6, max: 12 },
  power: { min: 4, max: 10 },
  endurance: { min: 8, max: 18 },
};

const IDEAL_SESSION_TIME_MIN = { min: 45, max: 75 }; // minutes
const MAX_SESSION_TIME_MIN = 120; // hard cap before steep penalty
const IDEAL_PUSH_PULL_RATIO = 1; // 1:1 target
const IDEAL_UPPER_LOWER_RATIO = 1;

const WEIGHTS_WORKOUT = {
  balance: 0.22,
  fatigue: 0.22,
  time: 0.12,
  energy: 0.1,
  skillRisk: 0.14,
  volume: 0.2,
};

const WEIGHTS_PROGRAM = {
  weeklyVolume: 0.4,
  recovery: 0.3,
  coverage: 0.15,
  balance: 0.15,
};

// What counts as "high set" for a single exercise inside one session (for penalties)
const HIGH_SETS_PER_MOVE = 6;

/* =========================
     Helpers
     ========================= */

type ExerciseLookup = (id: string) => Exercise | undefined;

type RatioPair = { a: number; b: number };
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function scoreFromRange(val: number, min: number, max: number) {
  if (val <= min) return clamp01(val / min);
  if (val >= max) return clamp01(1 - (val - max) / (max || 1));
  // bell-ish shape centered in [min,max]
  const mid = (min + max) / 2;
  const half = (max - min) / 2;
  return clamp01(1 - Math.abs(val - mid) / half);
}

function ratioScore({ a, b }: RatioPair, ideal = 1) {
  if (a === 0 && b === 0) return 0.5;
  const r = a / Math.max(1e-6, b);
  // score 1 at ideal, falls off as deviate (log-ish)
  return clamp01(1 - Math.abs(Math.log((r + 1e-6) / ideal)));
}

function sum<T>(arr: T[], f: (x: T) => number) {
  return arr.reduce((s, x) => s + f(x), 0);
}
function countSets(we: WorkoutExercise) {
  return we.sets?.length ?? 0;
}

function getMajorGroup(
  cat: ExerciseCategory
): "push" | "pull" | "legs" | "other" {
  switch (cat) {
    case "push_horizontal":
    case "push_vertical":
      return "push";
    case "pull_horizontal":
    case "pull_vertical":
      return "pull";
    case "squat":
    case "hinge":
    case "lunge":
    case "hinge_horizontal":
      return "legs";
    default:
      return "other";
  }
}

function minutesFromRestSeconds(totalRestSeconds: number) {
  return totalRestSeconds / 60;
}

/* =========================
     Set/Exercise Aggregation
     ========================= */

type ExerciseSignal = {
  sets: number;
  estVolume: number; // arbitrary units using exercise.volume_per_set
  cns: number; // 0-1 weighted by set count
  metabolic: number; // 0-1 weighted by set count
  joint: number; // 0-1 weighted by set count
  skill: number; // 0-1 (skill requirement proxy)
  energy: Record<EnergySystem, number>;
  restSeconds: number;
  timeMin: number; // crude estimate
  muscles: Array<{ id: string; contribution: number; recoveryDays: number }>;
  category: ExerciseCategory | "other";
  group: "push" | "pull" | "legs" | "other";
};

function buildExerciseSignal(
  we: WorkoutExercise,
  ex: Exercise,
  goal: ProgramGoal
): ExerciseSignal {
  const sets = countSets(we);
  const perSetVol =
    goal === "strength"
      ? ex.volume_per_set.strength
      : ex.volume_per_set.hypertrophy;

  const estVolume = sets * Math.max(0, perSetVol || 1);

  const avgRest =
    Math.round(
      (we.sets?.reduce((acc, s) => acc + (s.rest ?? 0), 0) || 0) /
        Math.max(1, sets)
    ) || 60;

  const restSeconds = avgRest * sets;

  // crude session-time estimate: 45–75s per hard set + rest
  const workSeconds = sets * 60; // ~1 min per set
  const timeMin = (workSeconds + restSeconds) / 60;

  const muscles = (ex.exercise_muscles || [])
    .filter((m): m is ExerciseMuscleJoined => !!m)
    .map((m) => ({
      id: m.muscles.id,
      contribution: m.contribution ?? 0.5,
      recoveryDays: ex.recovery_days ?? 1.5,
    }));

  return {
    sets,
    estVolume,
    cns: (ex.cns_demand || 0) * sets,
    metabolic: (ex.metabolic_demand || 0) * sets,
    joint: (ex.joint_stress || 0) * sets,
    skill:
      ({ low: 0.2, moderate: 0.6, high: 1 } as any)[ex.skill_requirement] ||
      0.4,
    energy: {
      "ATP-CP": 0,
      Glycolytic: 0,
      Oxidative: 0,
      [ex.energy_system]: sets,
    },
    restSeconds,
    timeMin,
    muscles,
    category: ex.category ?? "other",
    group: getMajorGroup(ex.category),
  };
}

function flattenExercises(groups: WorkoutExerciseGroup[]) {
  const exs: WorkoutExercise[] = [];
  for (const g of groups) exs.push(...g.exercises);
  return exs;
}

/* =========================
     Workout Score
     ========================= */

export type WorkoutScore = {
  score: number; // 0–100
  components: {
    balance: number;
    fatigue: number;
    time: number;
    energy: number;
    skillRisk: number;
    volume: number;
  };
  estimates: {
    timeMin: number;
    totalSets: number;
    pushSets: number;
    pullSets: number;
    legSets: number;
    weeklyVolumeUnits?: number; // filled at program-level aggregation
  };
  hints: string[];
};

export function scoreWorkout(
  workout: Workout,
  goal: ProgramGoal,
  lookup: ExerciseLookup
): WorkoutScore {
  const exercises = flattenExercises(workout.exercise_groups);

  const signals: ExerciseSignal[] = [];
  for (const we of exercises) {
    const ex = lookup(we.exercise_id);
    if (!ex) continue;
    signals.push(buildExerciseSignal(we, ex, goal));
  }

  const totalSets = sum(signals, (s) => s.sets);
  const estTime = sum(signals, (s) => s.timeMin);
  const estRest = sum(signals, (s) => minutesFromRestSeconds(s.restSeconds));
  const totalTime = estTime; // (work+rest already inside timeMin)

  const pushSets = sum(signals, (s) => (s.group === "push" ? s.sets : 0));
  const pullSets = sum(signals, (s) => (s.group === "pull" ? s.sets : 0));
  const legSets = sum(signals, (s) => (s.group === "legs" ? s.sets : 0));

  const balancePushPull = ratioScore(
    { a: pushSets, b: pullSets },
    IDEAL_PUSH_PULL_RATIO
  );
  const balanceUpperLower = ratioScore(
    { a: pushSets + pullSets, b: legSets },
    IDEAL_UPPER_LOWER_RATIO
  );
  const balanceScore =
    100 * 0.6 * balancePushPull + 100 * 0.4 * balanceUpperLower;

  // Fatigue/joint/skill risk scaled by sets; lower is better → invert
  const fatigueRaw =
    sum(signals, (s) => s.cns + s.metabolic) / Math.max(1, totalSets); // 0–2 avg
  const jointRaw = sum(signals, (s) => s.joint) / Math.max(1, totalSets); // 0–1 avg-ish
  const skillRaw = sum(signals, (s) => s.skill) / Math.max(1, signals.length); // 0–1

  const fatigueScore = 100 * (1 - clamp01(fatigueRaw / 1.2)); // tuned
  const skillRiskScore = 100 * (1 - clamp01(jointRaw * 0.6 + skillRaw * 0.4));

  // Volume heuristic: more isn’t always better. Reward moderate total sets.
  // 12–24 sets per session across bodyparts tends to be sane.
  const volumeScore = 100 * scoreFromRange(totalSets, 10, 24);

  // Time score: best in 45–75 min, penalize very long
  const timeScore =
    100 *
    (0.8 *
      scoreFromRange(
        totalTime,
        IDEAL_SESSION_TIME_MIN.min,
        IDEAL_SESSION_TIME_MIN.max
      ) +
      0.2 * (1 - clamp01(Math.max(0, totalTime - MAX_SESSION_TIME_MIN) / 30)));

  // Energy system diversity — avoid 100% one bucket unless plan dictates
  const energyTotals = signals.reduce(
    (acc, s) => {
      acc["ATP-CP"] += s.energy["ATP-CP"] || 0;
      acc["Glycolytic"] += s.energy["Glycolytic"] || 0;
      acc["Oxidative"] += s.energy["Oxidative"] || 0;
      return acc;
    },
    { "ATP-CP": 0, Glycolytic: 0, Oxidative: 0 }
  );
  const energySum = Object.values(energyTotals).reduce((a, b) => a + b, 0) || 1;
  const energyEntropy = -(["ATP-CP", "Glycolytic", "Oxidative"] as const)
    .map((k) => {
      const p = (energyTotals[k] || 0) / energySum;
      return p > 0 ? p * Math.log2(p) : 0;
    })
    .reduce((a, b) => a + b, 0);
  const maxEntropy = Math.log2(3);
  const energyScore = 100 * (energyEntropy / maxEntropy); // 0–100, higher = more balanced spread

  const components = {
    balance: balanceScore,
    fatigue: fatigueScore,
    time: timeScore,
    energy: energyScore,
    skillRisk: skillRiskScore,
    volume: volumeScore,
  };

  const overall =
    WEIGHTS_WORKOUT.balance * components.balance +
    WEIGHTS_WORKOUT.fatigue * components.fatigue +
    WEIGHTS_WORKOUT.time * components.time +
    WEIGHTS_WORKOUT.energy * components.energy +
    WEIGHTS_WORKOUT.skillRisk * components.skillRisk +
    WEIGHTS_WORKOUT.volume * components.volume;

  // Hints
  const hints: string[] = [];
  if (pushSets > pullSets * 1.4)
    hints.push("Push exceeds pull — add rows/pull-ups to balance.");
  if (pullSets > pushSets * 1.4)
    hints.push("Pull exceeds push — add presses to balance.");
  if (totalTime > 90)
    hints.push("Session is long — consider trimming sets or rests.");
  if (signals.some((s) => s.sets >= HIGH_SETS_PER_MOVE))
    hints.push(
      "High sets on a single movement — consider splitting across days."
    );
  if (components.skillRisk < 55)
    hints.push("High joint/skill demand — watch technique and load.");
  if (components.volume < 55)
    hints.push("Low total sets — consider adding working sets.");

  return {
    score: Math.round(overall),
    components,
    estimates: {
      timeMin: Math.round(totalTime),
      totalSets,
      pushSets,
      pullSets,
      legSets,
    },
    hints,
  };
}

/* =========================
     Program Score (weekly)
     ========================= */

export type ProgramScore = {
  score: number;
  components: {
    weeklyVolume: number;
    recovery: number;
    coverage: number;
    balance: number;
  };
  details: {
    muscleWeeklySets: Record<string, number>; // id → sets (weighted)
    recoveryWarnings: Array<{
      muscleId: string;
      dayIndex: number;
      note: string;
    }>;
    dayScores: Array<{ dayId: string; workoutScore: number }>;
  };
  hints: string[];
};

// Weight a set → contribution share for each muscle on that exercise
function distributeSetToMuscles(
  muscles: ExerciseMuscleJoined[] | null | undefined
) {
  const list = (muscles || []).filter(Boolean);
  const total = list.reduce((s, m) => s + (m.contribution ?? 0.5), 0) || 1;
  return list.map((m) => ({
    id: m.muscles.id,
    weight: (m.contribution ?? 0.5) / total,
  }));
}

export function scoreProgram(
  program: Program,
  lookup: ExerciseLookup
): ProgramScore {
  const days: ProgramDay[] = (
    program.days ??
    program.blocks?.flatMap((b) => b.days) ??
    []
  ).filter((d) => d.type === "workout");

  // Aggregate day-level workout scores (averaged if multiple workouts in a day)
  const dayScores = days.map((d) => {
    const ws = d.workout.map(
      (w) => scoreWorkout(w, program.goal, lookup).score
    );
    const avg = ws.length
      ? Math.round(ws.reduce((a, b) => a + b, 0) / ws.length)
      : 0;
    return { dayId: d.id, workoutScore: avg };
  });

  // Weekly muscle volume and recovery overlap
  const muscleWeeklySets: Record<string, number> = {};
  const recoveryWarnings: Array<{
    muscleId: string;
    dayIndex: number;
    note: string;
  }> = [];

  days.forEach((day, idx) => {
    const exs = day.workout.flatMap((w) => flattenExercises(w.exercise_groups));
    const stamps: Array<{ muscleId: string; sets: number; recovery: number }> =
      [];

    for (const we of exs) {
      const ex = lookup(we.exercise_id);
      if (!ex) continue;
      const perMuscle = distributeSetToMuscles(ex.exercise_muscles);
      const sets = countSets(we);

      for (const m of perMuscle) {
        const add = sets * m.weight;
        muscleWeeklySets[m.id] = (muscleWeeklySets[m.id] || 0) + add;
        stamps.push({
          muscleId: m.id,
          sets: add,
          recovery: ex.recovery_days ?? 1.5,
        });
      }
    }

    // overlap check: if the same muscle was hit recently with high sets and recovery not met
    if (idx > 0) {
      for (const s of stamps) {
        // naive window: look back 1 day
        const prevDay = idx - 1;
        const prevExs = days[prevDay].workout.flatMap((w) =>
          flattenExercises(w.exercise_groups)
        );
        const prevSetsForMuscle = prevExs.reduce((acc, wePrev) => {
          const exPrev = lookup(wePrev.exercise_id);
          if (!exPrev) return acc;
          const distPrev = distributeSetToMuscles(exPrev.exercise_muscles);
          const share = distPrev.find((p) => p.id === s.muscleId)?.weight ?? 0;
          return acc + countSets(wePrev) * share;
        }, 0);

        if (prevSetsForMuscle >= 4 && s.recovery > 1.0) {
          recoveryWarnings.push({
            muscleId: s.muscleId,
            dayIndex: idx,
            note: "Back-to-back high volume with <48h typical recovery.",
          });
        }
      }
    }
  });

  // Weekly volume score (per-muscle target band)
  const { min, max } = TARGET_SETS_PER_MUSCLE[program.goal];
  const volScores = Object.values(muscleWeeklySets).map((sets) =>
    scoreFromRange(sets, min, max)
  );
  const weeklyVolume =
    100 *
    (volScores.reduce((a, b) => a + b, 0) / Math.max(1, volScores.length));

  // Coverage: how many major groups got at least ~min/2 sets
  const covered = Object.values(muscleWeeklySets).filter(
    (s) => s >= min * 0.5
  ).length;
  const totalMuscles = Object.keys(muscleWeeklySets).length || 1;
  const coverage = 100 * clamp01(covered / totalMuscles);

  // Program-level balance via push/pull/legs sets
  const totalsByGroup = { push: 0, pull: 0, legs: 0, other: 0 };
  days.forEach((day) => {
    day.workout.forEach((w) => {
      flattenExercises(w.exercise_groups).forEach((we) => {
        const ex = lookup(we.exercise_id);
        if (!ex) return;
        const g = getMajorGroup(ex.category);
        totalsByGroup[g] += countSets(we);
      });
    });
  });
  const balance =
    100 *
    (0.6 *
      ratioScore(
        { a: totalsByGroup.push, b: totalsByGroup.pull },
        IDEAL_PUSH_PULL_RATIO
      ) +
      0.4 *
        ratioScore(
          { a: totalsByGroup.push + totalsByGroup.pull, b: totalsByGroup.legs },
          1
        ));

  // Recovery score: fewer warnings → higher score
  const recovery =
    100 * (1 - clamp01(recoveryWarnings.length / Math.max(1, days.length)));

  const components = { weeklyVolume, recovery, coverage, balance };

  const overall =
    WEIGHTS_PROGRAM.weeklyVolume * components.weeklyVolume +
    WEIGHTS_PROGRAM.recovery * components.recovery +
    WEIGHTS_PROGRAM.coverage * components.coverage +
    WEIGHTS_PROGRAM.balance * components.balance;

  // Hints
  const hints: string[] = [];
  if (components.weeklyVolume < 60)
    hints.push("Low weekly volume for goal — add sets to key muscles.");
  if (components.recovery < 70)
    hints.push("Recovery overlaps detected — spread high-volume days apart.");
  if (components.coverage < 70)
    hints.push("Important muscles under-served — ensure full-body coverage.");
  if (components.balance < 70)
    hints.push("Push/Pull/Legs imbalance — even out set distribution.");

  return {
    score: Math.round(overall),
    components,
    details: {
      muscleWeeklySets,
      recoveryWarnings,
      dayScores,
    },
    hints,
  };
}
