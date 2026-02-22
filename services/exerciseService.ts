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

/** Map legacy broad categories to the new per-scheme tracking types. */
const LEGACY_MAP: Record<string, TrackingType[]> = {
  reps: ["fixed", "range", "amrap"],
  time: ["time"],
  distance: ["distance", "time"],
};

function normTrackingType(raw: unknown): TrackingType[] {
  const VALID: Set<string> = new Set([
    "fixed", "range", "time", "each_side", "amrap", "distance",
  ]);
  const arr: string[] = Array.isArray(raw) ? raw : [raw ?? "reps"];
  // Expand any legacy tokens, then keep only valid values
  const expanded = arr.flatMap((t) => LEGACY_MAP[t] ?? [t]);
  const unique = [...new Set(expanded)].filter((v) => VALID.has(v)) as TrackingType[];
  return unique.length ? unique : ["fixed", "range", "amrap"];
}

function shapeExercise(ex: any): Exercise {
  return {
    ...ex,
    tracking_type: normTrackingType(ex.tracking_type),
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
