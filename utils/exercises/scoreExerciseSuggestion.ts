import { Exercise, Muscle } from "@/types/Exercise";
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
  for (const muscle in candidate.activation_map) {
    const activation = candidate.activation_map[muscle as Muscle] ?? 0;
    const current = insights?.muscle_volumes?.[muscle as Muscle] ?? 0;
    if (current < 0.3 && activation > 0.4) {
      score += 10;
    }
  }

  // 🤝 Complementary movement pattern
  const hasSameCategory = currentWorkout.some((ex) =>
    ex.workout.some((w) =>
      w.exercises.some((e) => e.exercise_id === candidate.id)
    )
  );
  if (!hasSameCategory) score += 5;

  // 🔄 Alternate movement plane
  const hasSamePlane = currentWorkout.some((ex) =>
    ex.workout.some((w) =>
      w.exercises.some((e) => e.exercise_id === candidate.id)
    )
  );
  if (!hasSamePlane) score += 3;

  // 🦾 Load profile variety
  const hasSameLoadProfile = currentWorkout.some((ex) =>
    ex.workout.some((w) =>
      w.exercises.some((e) => e.exercise_id === candidate.id)
    )
  );
  if (!hasSameLoadProfile) score += 2;

  // 🧠 Fatigue balance
  const fatigueScore = 1 - candidate.fatigue_index;
  score += fatigueScore * 4;

  return score;
}
