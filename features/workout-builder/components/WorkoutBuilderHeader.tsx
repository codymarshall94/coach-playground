import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ProgramPreview from "@/features/workout-builder/components/program/ProgramPreview";
import { Exercise } from "@/types/Exercise";
import { Program } from "@/types/Workout";
import { Save } from "lucide-react";
import { ExerciseLibrary } from "./exercises/ExerciseLibrary";

export const WorkoutBuilderHeader = ({
  program,
  isSaving,
  handleSave,
  isWorkoutDay,
  addExercise,
  exerciseLibraryOpen,
  setExerciseLibraryOpen,
}: {
  program: Program;
  isSaving: boolean;
  handleSave: () => void;
  isWorkoutDay: boolean;
  addExercise: (exercise: Exercise) => void;
  exerciseLibraryOpen: boolean;
  setExerciseLibraryOpen: (open: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-30 bg-background border-b border-border px-6 py-3 flex justify-between items-center shadow-sm">
      <Logo size="xs" lineBreak={false} />
      <div className="flex gap-2">
        <ThemeToggle />
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <ProgramPreview program={program} />
        {isWorkoutDay && (
          <ExerciseLibrary
            addExercise={addExercise}
            open={exerciseLibraryOpen}
            setOpen={setExerciseLibraryOpen}
          />
        )}
        <Avatar>
          <AvatarImage src={""} />
          <AvatarFallback>{"A"}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
