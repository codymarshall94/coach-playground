import { ExerciseCategory } from "@/types/Exercise";
import { WorkoutTypes } from "@/types/Workout";

const CATEGORY_MAP: Record<string, WorkoutTypes> = {
  strength: "strength",
  hypertrophy: "hypertrophy",
  endurance: "endurance",
  power: "power",
  balance: "balance",
  other: "other",
};

export const getWorkoutTypeFromCategories = (
  category_counts: Record<ExerciseCategory, number>
): WorkoutTypes => {
  const sorted = Object.entries(category_counts).sort((a, b) => b[1] - a[1]);
  const topCategory = sorted[0]?.[0];
  return CATEGORY_MAP[topCategory] ?? "other";
};
