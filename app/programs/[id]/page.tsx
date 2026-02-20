import { WorkoutBuilder } from "@/features/workout-builder/WorkoutBuilder";
import { createClient } from "@/utils/supabase/server";
import { PROGRAM_DETAIL_SELECT } from "@/services/programQueries";
import { transformProgramFromSupabase } from "@/utils/program/transformProgram";

export default async function ProgramEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("programs")
    .select(PROGRAM_DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("❌ Failed to fetch program", error?.message);
    return <p>Failed to load program</p>;
  }

  return <WorkoutBuilder initialProgram={transformProgramFromSupabase(data)} />;
}
