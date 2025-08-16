import { Exercise } from "@/types/Exercise";
import { ProgramDay } from "@/types/Workout";
import { analyzeWorkoutDay } from "../analyzeWorkoutDay";

export function scoreExerciseSuggestion({
  candidate,
  currentWorkout,
  insights,
}: {
  candidate: Exercise;
  currentWorkout: ProgramDay[];
  insights: ReturnType<typeof analyzeWorkoutDay>;
}): number {
  let score = 0;

  // 🧠 Fill gaps in muscle activation
  for (const muscle of candidate.exercise_muscles ?? []) {
    const activation = muscle.contribution ?? 0;
    const current = insights?.muscle_volumes?.[muscle.muscles.id] ?? 0;
    if (current < 0.3 && activation > 0.4) {
      score += 10;
    }
  }

  // 🤝 Complementary movement pattern
  const hasSameCategory = currentWorkout.some((day) =>
    day.workout?.[0]?.exercise_groups?.some((g) =>
      g.exercises.some((e) => e.exercise_id === candidate.id)
    )
  );
  if (!hasSameCategory) score += 5;

  // 🔄 Alternate movement plane
  const hasSamePlane = currentWorkout.some((day) =>
    day.workout?.[0]?.exercise_groups?.some((g) =>
      g.exercises.some((e) => e.exercise_id === candidate.id)
    )
  );
  if (!hasSamePlane) score += 3;

  // 🦾 Load profile variety
  const hasSameLoadProfile = currentWorkout.some((day) =>
    day.workout?.[0]?.exercise_groups?.some((g) =>
      g.exercises.some((e) => e.exercise_id === candidate.id)
    )
  );
  if (!hasSameLoadProfile) score += 2;

  // 🧠 Fatigue balance
  const fatigueScore = 1 - candidate.fatigue_index;
  score += fatigueScore * 4;

  return score;
}
