"use client";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import ProgramPreview from "@/features/workout-builder/components/program/ProgramPreview";
import { cn } from "@/lib/utils";
import { Exercise } from "@/types/Exercise";
import { Program } from "@/types/Workout";
import { User } from "@supabase/supabase-js";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import AvatarDropdown from "./AvatarDropdown";
import { ExerciseLibrary } from "./exercises/ExerciseLibrary";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";

export const WorkoutBuilderHeader = ({
  program,
  isSaving,
  handleSave,
  isWorkoutDay,
  addExercise,
  exerciseLibraryOpen,
  setExerciseLibraryOpen,
  user,
  showShortcutsModal,
  setShowShortcutsModal,
  programPreviewOpen,
  setProgramPreviewOpen,
}: {
  program: Program;
  isSaving: boolean;
  handleSave: () => void;
  isWorkoutDay: boolean;
  addExercise: (exercise: Exercise) => void;
  exerciseLibraryOpen: boolean;
  setExerciseLibraryOpen: (open: boolean) => void;
  user: User | null;
  showShortcutsModal: boolean;
  setShowShortcutsModal: (open: boolean) => void;
  programPreviewOpen: boolean;
  setProgramPreviewOpen: (open: boolean) => void;
}) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-background border-b border-border px-6 py-3 flex justify-between items-center shadow-sm">
      <Logo size="xs" showIcon />

      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "h-9 sm:h-10 flex items-center justify-center gap-2 px-4 transition-all duration-200",
            isSaving && " cursor-wait"
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Draft
            </>
          )}
        </Button>

        <ProgramPreview
          program={program}
          open={programPreviewOpen}
          onOpenChange={setProgramPreviewOpen}
        />

        {isWorkoutDay && (
          <ExerciseLibrary
            addExercise={addExercise}
            open={exerciseLibraryOpen}
            setOpen={setExerciseLibraryOpen}
          />
        )}

        <div className="h-6 w-px bg-border mx-1 sm:mx-2" />

        <ThemeToggle />

        <KeyboardShortcutsModal
          open={showShortcutsModal}
          onOpenChange={setShowShortcutsModal}
        />

        {user ? (
          <AvatarDropdown />
        ) : (
          <Button onClick={() => router.push("/login")}>Log in</Button>
        )}
      </div>
    </header>
  );
};
