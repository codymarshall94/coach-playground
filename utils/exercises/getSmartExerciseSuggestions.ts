import { Exercise } from "@/types/Exercise";
import { ProgramDay } from "@/types/Workout";
import { analyzeWorkoutDay } from "@/utils/analyzeWorkoutDay";
import { scoreExerciseSuggestion } from "./scoreExerciseSuggestion";

export function getSmartExerciseSuggestions({
  allExercises,
  currentWorkout,
}: {
  allExercises: Exercise[];
  currentWorkout: ProgramDay[];
}) {
  const currentWorkoutExercises = currentWorkout.flatMap(
    (day) => day.workout?.[0]?.exercise_groups ?? []
  );
  const insights = analyzeWorkoutDay(currentWorkoutExercises, allExercises);

  const scored = allExercises
    .map((exercise) => ({
      exercise,
      score: scoreExerciseSuggestion({
        candidate: exercise,
        currentWorkout,
        insights,
      }),
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 5); // top 5 suggestions
}
