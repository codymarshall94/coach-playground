import { fetchAllExercises, fetchExerciseById } from "@/lib/supabase/exercises";
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

export async function getExerciseWithFormattedCues(
  id: string
): Promise<Exercise & { cues: string[] }> {
  const { data, error } = await fetchExerciseById(id);
  if (error || !data) throw new Error(error?.message || "Exercise not found");

  const shaped = shapeExercise(data);
  return {
    ...shaped,
    cues: (data.cues ?? []).map((c: string, i: number) => `${i + 1}. ${c}`),
  };
}
