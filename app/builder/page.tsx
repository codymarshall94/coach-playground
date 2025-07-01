import { WorkoutBuilder } from "@/features/workout-builder/WorkoutBuilder";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Workout Builder | Workout Sandbox",
  description:
    "Build, preview, and customize your training sessions in the Workout Sandbox.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function BuilderPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <WorkoutBuilder user={user} />;
}
