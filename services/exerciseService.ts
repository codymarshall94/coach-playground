import { fetchAllExercises, fetchExerciseById } from "@/lib/supabase/exercises";

export async function getAllExercises() {
  const { data, error } = await fetchAllExercises();
  if (error) throw new Error("Failed to load exercises");

  return data.map((ex) => ({
    ...ex,
    fatigue: {
      index: ex.fatigue_index ?? 0,
      cns_demand: ex.cns_demand ?? 0,
      metabolic_demand: ex.metabolic_demand ?? 0,
      joint_stress: ex.joint_stress ?? 0,
    },
  }));
}

export async function getExerciseWithFormattedCues(id: string) {
  const { data, error } = await fetchExerciseById(id);
  if (error) throw new Error("Exercise not found");

  return {
    ...data,
    cues: data.cues.map((c: string, i: number) => `${i + 1}. ${c}`),
  };
}
