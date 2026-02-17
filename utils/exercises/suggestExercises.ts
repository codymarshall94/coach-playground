import type { Exercise, ExerciseCategory, MuscleRegion } from "@/types/Exercise";
import type { WorkoutExerciseGroup } from "@/types/Workout";

// ─── Day intent detection ────────────────────────────────────────
// The algorithm first figures out *what kind of day* the user is
// building, then suggests exercises that continue that theme.

/** Broad day-theme labels the algorithm can detect. */
export type DayIntent =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "push"
  | "pull"
  | "upper"
  | "lower"
  | "legs"
  | "posterior_chain"
  | "full_body"
  | "power"
  | "core"
  | "empty";

// ─── Category → region / theme mappings ─────────────────────────

const UPPER_PUSH_CATEGORIES: ExerciseCategory[] = [
  "push_horizontal",
  "push_vertical",
];
const UPPER_PULL_CATEGORIES: ExerciseCategory[] = [
  "pull_horizontal",
  "pull_vertical",
];
const UPPER_CATEGORIES: ExerciseCategory[] = [
  ...UPPER_PUSH_CATEGORIES,
  ...UPPER_PULL_CATEGORIES,
];
const LOWER_CATEGORIES: ExerciseCategory[] = [
  "squat",
  "hinge",
  "hinge_horizontal",
  "lunge",
];
const POWER_CATEGORIES: ExerciseCategory[] = ["jump", "sprint", "throw"];

// Muscle group → which muscle IDs belong to it
const MUSCLE_GROUPS: Record<string, string[]> = {
  chest: ["pectoralis_major"],
  back: [
    "latissimus_dorsi",
    "rhomboids",
    "lower_traps",
    "upper_traps",
    "erector_spinae",
  ],
  shoulders: ["anterior_deltoid", "lateral_deltoid", "posterior_deltoid"],
  triceps: ["triceps_brachii"],
  biceps: ["biceps"],
  arms: ["biceps", "triceps_brachii", "forearm"],
  quads: ["quadriceps", "sartorius"],
  hamstrings: ["hamstrings"],
  glutes: ["gluteus_maximus"],
  core: ["core"],
};

// Categories that "fit" each intent — used to score candidates
const INTENT_CATEGORIES: Record<DayIntent, ExerciseCategory[]> = {
  chest: ["push_horizontal"],
  back: ["pull_horizontal", "pull_vertical"],
  shoulders: ["push_vertical"],
  arms: ["pull_vertical", "push_vertical", "push_horizontal", "other"],
  push: ["push_horizontal", "push_vertical"],
  pull: ["pull_horizontal", "pull_vertical"],
  upper: [...UPPER_CATEGORIES],
  lower: [...LOWER_CATEGORIES],
  legs: [...LOWER_CATEGORIES],
  posterior_chain: ["hinge", "hinge_horizontal"],
  full_body: [
    ...UPPER_CATEGORIES,
    ...LOWER_CATEGORIES,
    "brace",
    "carry",
  ],
  power: ["jump", "sprint", "throw", "hinge"],
  core: ["brace"],
  empty: [],
};

// Human-friendly labels for reasons
const INTENT_LABELS: Record<DayIntent, string> = {
  chest: "Chest day",
  back: "Back day",
  shoulders: "Shoulder day",
  arms: "Arms day",
  push: "Push day",
  pull: "Pull day",
  upper: "Upper day",
  lower: "Lower day",
  legs: "Leg day",
  posterior_chain: "Posterior chain",
  full_body: "Full body",
  power: "Power / speed day",
  core: "Core day",
  empty: "",
};

// ─── Public API ──────────────────────────────────────────────────

export interface SuggestedExercise {
  exercise: Exercise;
  /** 0-100 composite score */
  score: number;
  /** Short label explaining the reasoning */
  reason: string;
}

// ─── Intent detection ────────────────────────────────────────────

interface WorkoutSnapshot {
  usedIds: Set<string>;
  categoryCounts: Partial<Record<ExerciseCategory, number>>;
  muscleGroupVolume: Record<string, number>;
  muscleVolume: Record<string, number>;
  regionSets: Record<MuscleRegion, number>;
  totalExercises: number;
  totalSets: number;
  totalFatigue: number;
}

function snapshot(
  exerciseGroups: WorkoutExerciseGroup[],
  allExercises: Exercise[]
): WorkoutSnapshot {
  const usedIds = new Set<string>();
  const categoryCounts: Partial<Record<ExerciseCategory, number>> = {};
  const muscleGroupVolume: Record<string, number> = {};
  const muscleVolume: Record<string, number> = {};
  const regionSets: Record<MuscleRegion, number> = {
    upper: 0,
    lower: 0,
    core: 0,
  };
  let totalExercises = 0;
  let totalSets = 0;
  let totalFatigue = 0;

  for (const g of exerciseGroups) {
    for (const we of g.exercises) {
      usedIds.add(we.exercise_id);
      const meta = allExercises.find((e) => e.id === we.exercise_id);
      if (!meta) continue;

      totalExercises++;
      const sets = we.sets.length;
      totalSets += sets;
      totalFatigue += meta.fatigue_index * sets;

      categoryCounts[meta.category] =
        (categoryCounts[meta.category] ?? 0) + 1;

      for (const em of meta.exercise_muscles ?? []) {
        const mid = em.muscles.id;
        muscleVolume[mid] =
          (muscleVolume[mid] ?? 0) + em.contribution * sets;
        regionSets[em.muscles.region] += sets;

        // Roll up into muscle groups
        for (const [group, ids] of Object.entries(MUSCLE_GROUPS)) {
          if (ids.includes(mid)) {
            muscleGroupVolume[group] =
              (muscleGroupVolume[group] ?? 0) + em.contribution * sets;
          }
        }
      }
    }
  }

  return {
    usedIds,
    categoryCounts,
    muscleGroupVolume,
    muscleVolume,
    regionSets,
    totalExercises,
    totalSets,
    totalFatigue,
  };
}

/**
 * Deduce the user's training intent from what they've already added.
 * Returns a ranked list of intents with confidence 0-1.
 */
function detectIntent(
  snap: WorkoutSnapshot
): { intent: DayIntent; confidence: number }[] {
  if (snap.totalExercises === 0) return [{ intent: "empty", confidence: 1 }];

  const total = snap.totalExercises;
  const scores: Partial<Record<DayIntent, number>> = {};

  // Helper: fraction of exercises in a set of categories
  const catFraction = (cats: ExerciseCategory[]) =>
    cats.reduce((n, c) => n + (snap.categoryCounts[c] ?? 0), 0) / total;

  // Helper: does a muscle group dominate? (> 60% of total volume)
  const totalVol = Object.values(snap.muscleGroupVolume).reduce(
    (a, b) => a + b,
    0
  );
  const groupFraction = (group: string) =>
    totalVol > 0 ? (snap.muscleGroupVolume[group] ?? 0) / totalVol : 0;

  // ── Specific body-part days (narrow) ──────────────────────────

  // Chest day: majority push_horizontal + chest muscle dominance
  const chestFrac = groupFraction("chest");
  if (chestFrac > 0.25 && catFraction(["push_horizontal"]) >= 0.4) {
    scores.chest = 0.5 + chestFrac * 0.5;
  }

  // Back day: mostly pulls + back muscles dominate
  const backFrac = groupFraction("back");
  if (
    backFrac > 0.25 &&
    catFraction(["pull_horizontal", "pull_vertical"]) >= 0.4
  ) {
    scores.back = 0.5 + backFrac * 0.5;
  }

  // Shoulder day: push_vertical dominant + shoulder muscles
  const shoulderFrac = groupFraction("shoulders");
  if (shoulderFrac > 0.3 && catFraction(["push_vertical"]) >= 0.3) {
    scores.shoulders = 0.4 + shoulderFrac * 0.5;
  }

  // Arms day: high bicep + tricep volume, mostly isolation
  const armFrac = groupFraction("arms");
  if (armFrac > 0.35) {
    scores.arms = 0.3 + armFrac * 0.5;
  }

  // Core day
  if (catFraction(["brace"]) >= 0.5) {
    scores.core = 0.6 + catFraction(["brace"]) * 0.3;
  }

  // ── Broader split patterns ────────────────────────────────────

  // Push day: mix of push_horizontal + push_vertical
  const pushFrac = catFraction(UPPER_PUSH_CATEGORIES);
  if (pushFrac >= 0.5 && !scores.chest && !scores.shoulders) {
    scores.push = 0.4 + pushFrac * 0.4;
  }

  // Pull day: mix of pull_horizontal + pull_vertical
  const pullFrac = catFraction(UPPER_PULL_CATEGORIES);
  if (pullFrac >= 0.5 && !scores.back) {
    scores.pull = 0.4 + pullFrac * 0.4;
  }

  // Upper day: mostly upper categories, mix of push & pull
  const upperFrac = catFraction(UPPER_CATEGORIES);
  if (upperFrac >= 0.6 && pushFrac > 0.1 && pullFrac > 0.1) {
    scores.upper = 0.3 + upperFrac * 0.4;
  }

  // Lower / legs day
  const lowerFrac = catFraction(LOWER_CATEGORIES);
  if (lowerFrac >= 0.5) {
    scores.lower = 0.4 + lowerFrac * 0.4;
    scores.legs = 0.35 + lowerFrac * 0.35;
  }

  // Posterior chain focus (hinge-heavy lower day)
  const hingeFrac = catFraction(["hinge", "hinge_horizontal"]);
  if (hingeFrac >= 0.4 && lowerFrac >= 0.5) {
    scores.posterior_chain = 0.3 + hingeFrac * 0.5;
  }

  // Power / speed day: jumps, sprints, throws, ballistic
  const powerFrac = catFraction(POWER_CATEGORIES);
  if (powerFrac >= 0.3) {
    scores.power = 0.4 + powerFrac * 0.5;
  }

  // Full body: meaningful upper AND lower
  if (upperFrac >= 0.25 && lowerFrac >= 0.25) {
    scores.full_body = 0.2 + Math.min(upperFrac, lowerFrac) * 0.3;
  }

  // Convert to sorted list
  const ranked = (Object.entries(scores) as [DayIntent, number][])
    .map(([intent, confidence]) => ({ intent, confidence }))
    .sort((a, b) => b.confidence - a.confidence);

  // Always return at least one intent
  return ranked.length > 0 ? ranked : [{ intent: "full_body", confidence: 0.2 }];
}

// ─── Main suggestion function ────────────────────────────────────

/**
 * Suggest 2-3 exercises that fit the detected day intent.
 *
 * Scoring (all additive):
 *  1. Intent alignment — does the exercise fit the detected day type?
 *  2. Muscle gap fill — within the day's muscles, what's under-hit?
 *  3. Accessory pairing — isolation work to finish off the day
 *  4. Fatigue budgeting — prefer lower fatigue late in session
 *  5. Duplicate avoidance + category diversity in results
 */
export function suggestExercises(
  exerciseGroups: WorkoutExerciseGroup[],
  allExercises: Exercise[],
  count = 3
): SuggestedExercise[] {
  if (allExercises.length === 0) return [];

  const snap = snapshot(exerciseGroups, allExercises);
  const intents = detectIntent(snap);
  const primaryIntent = intents[0];
  const secondaryIntent = intents[1];

  const isEmptyWorkout = snap.totalExercises === 0;

  // Categories that "belong" on this day
  const dayCategories = new Set<ExerciseCategory>(
    INTENT_CATEGORIES[primaryIntent.intent]
  );
  if (secondaryIntent) {
    for (const c of INTENT_CATEGORIES[secondaryIntent.intent]) {
      dayCategories.add(c);
    }
  }

  // Muscles already trained — for gap detection within the day's scope
  const dayMuscles = new Set<string>();
  for (const cat of dayCategories) {
    // Find all muscles that exercises in this category typically hit
    for (const ex of allExercises) {
      if (ex.category === cat) {
        for (const em of ex.exercise_muscles ?? []) {
          dayMuscles.add(em.muscles.id);
        }
      }
    }
  }

  // ── Score every candidate ─────────────────────────────────────
  const scored: SuggestedExercise[] = [];
  const intentLabel = INTENT_LABELS[primaryIntent.intent];

  for (const ex of allExercises) {
    if (snap.usedIds.has(ex.id)) continue;

    let score = 0;
    const reasons: string[] = [];

    if (isEmptyWorkout) {
      if (ex.compound) score += 25;
      score += (1 - ex.fatigue_index) * 10;
      reasons.push("Good starting exercise");
    } else {
      // ── 1. Intent alignment (0-40 pts) ──────────────────────
      // Does this exercise belong on this type of day?
      if (dayCategories.has(ex.category)) {
        score += 30;
        // Extra boost if it's an exact fit for the primary intent
        if (INTENT_CATEGORIES[primaryIntent.intent].includes(ex.category)) {
          score += 10;
        }
        reasons.push(`Fits your ${intentLabel.toLowerCase()}`);
      } else {
        // Major penalty for off-theme exercises
        // A lower-body exercise on a chest day should basically never appear
        score -= 20;
      }

      // ── 2. Muscle gap fill within the day's theme (0-25 pts) ─
      let gapScore = 0;
      for (const em of ex.exercise_muscles ?? []) {
        const mid = em.muscles.id;
        // Only care about muscles relevant to this day type
        if (!dayMuscles.has(mid)) continue;

        const currentVol = snap.muscleVolume[mid] ?? 0;
        if (currentVol === 0) {
          gapScore += em.contribution * 15;
          if (em.role === "prime") gapScore += 5;
        } else if (currentVol < 2) {
          gapScore += em.contribution * 6;
        }
      }
      gapScore = Math.min(gapScore, 25);
      if (gapScore > 8 && reasons.length === 0) {
        reasons.push("Targets under-hit muscles");
      }
      score += gapScore;

      // ── 3. Accessory / isolation to finish (0-15 pts) ────────
      // If the day already has compounds, suggest isolation finishers
      const compoundCount = [...snap.usedIds].filter((id) => {
        const m = allExercises.find((e) => e.id === id);
        return m?.compound;
      }).length;

      if (compoundCount >= 2 && !ex.compound && dayCategories.has(ex.category)) {
        score += 12;
        if (reasons.length === 0) reasons.push("Isolation finisher");
      } else if (compoundCount === 0 && ex.compound && dayCategories.has(ex.category)) {
        score += 10;
        if (reasons.length === 0) reasons.push("Add a compound lift");
      }

      // ── 4. Fatigue budget (0-10 pts) ─────────────────────────
      const avgFatigue =
        snap.totalSets > 0 ? snap.totalFatigue / snap.totalSets : 0;
      if (avgFatigue > 0.6) {
        score += (1 - ex.fatigue_index) * 10;
        if (ex.fatigue_index < 0.3 && reasons.length === 0)
          reasons.push("Low fatigue finisher");
      }

      // ── 5. Core / carry as universal accessories (0-8 pts) ──
      // Always reasonable to add a core or carry exercise at end of day
      if (
        (ex.category === "brace" || ex.category === "carry") &&
        primaryIntent.intent !== "core" &&
        !snap.categoryCounts[ex.category]
      ) {
        score += 5;
        if (reasons.length === 0) reasons.push("Core / stability finisher");
      }
    }

    // Tiebreaker: prefer exercises with muscle data
    if ((ex.exercise_muscles?.length ?? 0) > 0) score += 1;

    if (reasons.length === 0) reasons.push("Complements workout");

    scored.push({ exercise: ex, score, reason: reasons[0] });
  }

  // ── Pick top N with category diversity ────────────────────────
  scored.sort((a, b) => b.score - a.score);

  const results: SuggestedExercise[] = [];
  const usedCategories = new Set<ExerciseCategory>();

  // First pass: diverse categories
  for (const s of scored) {
    if (results.length >= count) break;
    if (s.score <= 0) continue;

    if (usedCategories.has(s.exercise.category) && results.length < count - 1) {
      continue;
    }

    results.push(s);
    usedCategories.add(s.exercise.category);
  }

  // Back-fill if needed
  if (results.length < count) {
    for (const s of scored) {
      if (results.length >= count) break;
      if (s.score <= 0) continue;
      if (results.some((r) => r.exercise.id === s.exercise.id)) continue;
      results.push(s);
    }
  }

  return results;
}
