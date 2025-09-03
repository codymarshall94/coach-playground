import { fetchAllExercises } from "@/lib/supabase/exercises";
import type {
  Exercise,
  ExerciseMuscleJoined,
  MuscleRow,
} from "@/types/Exercise";

function shapeExercise(ex: any): Exercise {
  return {
    ...ex,
    exercise_muscles: (ex.exercise_muscles ?? []).map((em: any) => ({
      role: em.role,
      contribution: em.contribution,
      muscles: {
        id: em.muscles.id,
        display_name: em.muscles.display_name,
        group_name: em.muscles.group_name,
      } as MuscleRow,
    })) as ExerciseMuscleJoined[],
  };
}

export async function getAllExercises(): Promise<Exercise[]> {
  const { data, error } = await fetchAllExercises();
  if (error) throw new Error(error.message || "Failed to load exercises");

  return (data ?? []).map(shapeExercise);
}
