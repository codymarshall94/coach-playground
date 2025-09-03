// app/programs/builder/page.tsx
import { WorkoutBuilder } from "@/features/workout-builder/WorkoutBuilder";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Workout Builder | PRGRM",
  description: "Build, preview, and customize your training sessions.",
  icons: { icon: "/favicon.ico" },
};

async function fetchProgramById(supabase: any, id: string) {
  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      *,
      blocks:program_blocks (
        *,
        days:program_days (
          *,
          groups:workout_exercise_groups (
            *,
            exercises:workout_exercises (
              *,
              sets:exercise_sets (*)
            )
          )
        )
      ),
      days:program_days (
        *,
        groups:workout_exercise_groups (
          *,
          exercises:workout_exercises (
            *,
            sets:exercise_sets (*)
          )
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export default async function BuilderPage({
  searchParams,
}: {
  searchParams?: Promise<{ template?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const supabase = await createClient();

  let initialProgram: any = undefined;

  // If a template id is present, clone it for the current user
  if (params.template) {
    // clone via RPC we created earlier
    const { data: newProgramId, error: cloneErr } = await supabase.rpc(
      "clone_program_from_template",
      { template_program_id: params.template }
    );
    if (cloneErr) {
      // If cloning fails (bad id or not signed-in), you can fall back to editing nothing/new
      console.error("clone_program_from_template error:", cloneErr);
    } else if (newProgramId) {
      initialProgram = await fetchProgramById(supabase, newProgramId as string);
    }
  }

  return <WorkoutBuilder initialProgram={initialProgram} />;
}
