import { createClient } from "@/utils/supabase/server";
import ProgramsView from "@/components/ProgramsView";
import Link from "next/link";

export default async function ProgramsPage() {
  const supabase = await createClient();

  // Authenticate user via Supabase Auth server for a reliable user object
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Show a simple prompt to sign in (server-rendered). The client can handle auth flow.
    return (
      <div className="mx-auto max-w-7xl p-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">Your Programs</h1>
        <p className="mb-6">Please sign in to view your programs.</p>
        <Link className="btn" href="/login">
          Sign in
        </Link>
      </div>
    );
  }

  // Fetch programs owned by current user (server-side)
  const { data: programs, error } = await supabase
    .from("programs")
    .select("id,name,description,goal,mode,created_at,updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[ProgramsPage] error fetching programs", error);
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold leading-tight">Your Programs</h1>
        {programs && programs.length > 0 ? (
          <Link href="/programs/new" className="inline-flex items-center gap-2 rounded-md bg-brand px-3 py-2 text-white">
            New Program
          </Link>
        ) : null}
      </div>

      {/* Client-side list with delete handling */}
      <ProgramsView initialPrograms={programs ?? []} />
    </div>
  );
}
