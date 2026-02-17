import { fetchAllExercises } from "@/lib/supabase/exercises";
import type {
  Exercise,
  ExerciseMuscleJoined,
  MuscleRow,
  MuscleRole,
  MuscleRegion,
  MuscleMovementType,
  TrackingType,
} from "@/types/Exercise";

function shapeExercise(ex: any): Exercise {
  return {
    ...ex,
    tracking_type: Array.isArray(ex.tracking_type)
      ? (ex.tracking_type as TrackingType[])
      : ([(ex.tracking_type ?? "reps")] as TrackingType[]),
    exercise_muscles: (ex.exercise_muscles ?? []).map((em: any) => ({
      role: (em.role ?? "synergist") as MuscleRole,
      contribution: em.contribution ?? 0.5,
      muscles: {
        id: em.muscles.id,
        display_name: em.muscles.display_name,
        group_name: em.muscles.group_name,
        region: (em.muscles.region ?? "upper") as MuscleRegion,
        movement_type: (em.muscles.movement_type ?? "neutral") as MuscleMovementType,
      } as MuscleRow,
    })) as ExerciseMuscleJoined[],
  };
}

export async function getAllExercises(): Promise<Exercise[]> {
  const { data, error } = await fetchAllExercises();
  if (error) throw new Error(error.message || "Failed to load exercises");

  return (data ?? []).map(shapeExercise);
}
