"use client";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ProgramPreview from "@/features/workout-builder/components/program/ProgramPreview";
import { Exercise } from "@/types/Exercise";
import { Program } from "@/types/Workout";
import { User } from "@supabase/supabase-js";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { ExerciseLibrary } from "./exercises/ExerciseLibrary";

export const WorkoutBuilderHeader = ({
  program,
  isSaving,
  handleSave,
  isWorkoutDay,
  addExercise,
  exerciseLibraryOpen,
  setExerciseLibraryOpen,
  user,
}: {
  program: Program;
  isSaving: boolean;
  handleSave: () => void;
  isWorkoutDay: boolean;
  addExercise: (exercise: Exercise) => void;
  exerciseLibraryOpen: boolean;
  setExerciseLibraryOpen: (open: boolean) => void;
  user: User | null;
}) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-background border-b border-border px-6 py-3 flex justify-between items-center shadow-sm">
      {/* Logo */}
      <Logo size="xs" showIcon={false} />

      {/* Right Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Core Actions */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-9 sm:h-10"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Draft"}
        </Button>

        <ProgramPreview program={program} />

        {isWorkoutDay && (
          <ExerciseLibrary
            addExercise={addExercise}
            open={exerciseLibraryOpen}
            setOpen={setExerciseLibraryOpen}
          />
        )}

        {/* Settings Button (optional for future features) */}
        {/* <Button variant="ghost" size="sm" className="hidden sm:flex">
          <Settings className="w-4 h-4 mr-1" />
          Settings
        </Button> */}

        {/* Divider */}
        <div className="h-6 w-px bg-border mx-1 sm:mx-2" />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Avatar */}
        {user ? (
          <Avatar className="ml-2 hover:ring-2 hover:ring-muted-foreground/20 transition">
            <AvatarImage src={""} />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        ) : (
          <Button onClick={() => router.push("/login")}>Log in</Button>
        )}
      </div>
    </header>
  );
};
