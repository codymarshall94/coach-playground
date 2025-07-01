import { WorkoutBuilder } from "@/features/workout-builder/WorkoutBuilder";
import { getProgramById } from "@/services/programService";

export default async function ProgramEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = await getProgramById(id);

  if (!program) return <p>Failed to load program</p>;

  return <WorkoutBuilder initialProgram={program} />;
}
