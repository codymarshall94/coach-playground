import { templateConfigs } from "@/config/templateConfigs";
import { WorkoutBuilder } from "@/features/workout-builder/WorkoutBuilder";

export const metadata = {
  title: "Workout Builder | PRGRM",
  description: "Build, preview, and customize your training sessions.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function BuilderPage({
  searchParams,
}: {
  searchParams?: Promise<{ template?: string }>;
}) {
  const templateSlug = (await searchParams)?.template;
  const template = templateConfigs.find((t) => t.id === templateSlug);

  return <WorkoutBuilder initialProgram={template} />;
}
