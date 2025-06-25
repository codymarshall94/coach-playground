import { WorkoutBuilder } from "@/components/WorkoutBuilder";

export default function BuilderPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mt-6 mb-2 text-center">
        Coach’s Playground
      </h1>
      <WorkoutBuilder />
    </div>
  );
}
