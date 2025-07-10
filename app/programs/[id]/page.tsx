import { WorkoutBuilder } from "@/features/workout-builder/WorkoutBuilder";
import { createClient } from "@/utils/supabase/server";

export default async function ProgramEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      *,
      blocks:program_blocks (
        *,
        days:program_days (
          *,
          workout:workouts (
            *,
            exercise_groups:workout_exercise_groups (
              *,
              exercises:workout_exercises (
                *,
                sets:exercise_sets (*)
              )
            )
          )
        )
      ),
      days:program_days (
        *,
        workout:workouts (
          *,
          exercise_groups:workout_exercise_groups (
            *,
            exercises:workout_exercises (
              *,
              sets:exercise_sets (*)
            )
          )
        )
      )
      `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("❌ Failed to fetch program", error?.message);
    return <p>Failed to load program</p>;
  }

  return <WorkoutBuilder initialProgram={data} />;
}
