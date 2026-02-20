// app/programs/builder/page.tsx
import { WorkoutBuilder } from "@/features/workout-builder/WorkoutBuilder";
import { createClient } from "@/utils/supabase/server";

import { Program } from "@/types/Workout";
import { transformProgramFromSupabase } from "@/utils/program/transformProgram";
import { PROGRAM_DETAIL_SELECT } from "@/services/programQueries";
import { SupabaseClient } from "@supabase/supabase-js";

export const metadata = {
  title: "Workout Builder | PRGRM",
  description: "Build, preview, and customize your training sessions.",
  icons: { icon: "/favicon.ico" },
};

async function fetchProgramById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("programs")
    .select(PROGRAM_DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (error) throw error;
  return transformProgramFromSupabase(data);
}

export default async function BuilderPage({
  searchParams,
}: {
  searchParams?: Promise<{ template?: string; guided?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const supabase = await createClient();

  // Authenticate user via Supabase Auth server (don't rely on local session storage)
  const { data: { user } } = await supabase.auth.getUser();

  let initialProgram: Program | undefined = undefined;

  // If a template id is present, clone it for the current user (only when authenticated)
  if (params.template) {
    if (!user) {
      // For unauthenticated users, load the template program directly so they can preview/build
      try {
        initialProgram = await fetchProgramById(supabase, params.template);
      } catch (err) {
        console.error("Failed to fetch template program:", err);
      }
    } else {
      // Authenticated users: clone template into their account via RPC
      const { data: newProgramId, error: cloneErr } = await supabase.rpc(
        "clone_program_from_template",
        { template_program_id: params.template }
      );
      if (cloneErr) {
        // If cloning fails (bad id or other issue), fall back to loading template
        console.error("clone_program_from_template error:", cloneErr);
        try {
          initialProgram = await fetchProgramById(supabase, params.template);
        } catch (err) {
          console.error("Failed to fetch template program after clone error:", err);
        }
      } else if (newProgramId) {
        initialProgram = await fetchProgramById(supabase, newProgramId as string);
      }
    }
  }

  return <WorkoutBuilder initialProgram={initialProgram} />;
}
