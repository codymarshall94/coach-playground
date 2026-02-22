"use client";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import ProgramPreview from "@/features/workout-builder/components/program/ProgramPreview";
import { cn } from "@/lib/utils";
import { Exercise } from "@/types/Exercise";
import { Program } from "@/types/Workout";
import { User } from "@supabase/supabase-js";
import { Circle, Globe, HelpCircle, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import AvatarDropdown from "./AvatarDropdown";
import { ExerciseLibrary } from "./exercises/ExerciseLibrary";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";

export const WorkoutBuilderHeader = ({
  program,
  isSaving,
  handleSave,
  hasUnsavedChanges,
  isWorkoutDay,
  addExercise,
  exercises,
  user,
  showShortcutsModal,
  setShowShortcutsModal,
  programPreviewOpen,
  setProgramPreviewOpen,
  exerciseLibraryOpen,
  setExerciseLibraryOpen,
  isSaved,
  onPublishClick,
}: {
  program: Program;
  isSaving: boolean;
  handleSave: () => void;
  hasUnsavedChanges: boolean;
  isWorkoutDay: boolean;
  addExercise: (exercise: Exercise) => void;
  exercises: Exercise[];
  user: User | null;
  showShortcutsModal: boolean;
  setShowShortcutsModal: (open: boolean) => void;
  programPreviewOpen: boolean;
  setProgramPreviewOpen: (open: boolean) => void;
  exerciseLibraryOpen: boolean;
  setExerciseLibraryOpen: (open: boolean) => void;
  /** True when the program has been saved at least once */
  isSaved: boolean;
  /** Opens the first-time publish flow */
  onPublishClick?: () => void;
}) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-background border-b border-border px-6 py-3 flex justify-between items-center shadow-sm">
      <Logo width={100} height={100} />

      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          onClick={handleSave}
          disabled={isSaving || !hasUnsavedChanges}
          className={cn(
            "relative h-9 sm:h-10 flex items-center justify-center gap-2 px-4 transition-all duration-200",
            hasUnsavedChanges
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground",
            isSaving && "cursor-wait"
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
              {hasUnsavedChanges ? "Save Draft" : "Saved"}
            </>
          )}
          {hasUnsavedChanges && !isSaving && (
            <Circle className="absolute -top-1 -right-1 w-2.5 h-2.5 fill-amber-500 text-amber-500" />
          )}
        </Button>

        {/* Publish button — first-time publish only */}
        {isSaved && !program.is_published && onPublishClick && (
          <Button
            variant="outline"
            onClick={onPublishClick}
            className="h-9 sm:h-10 gap-2 px-4 border-primary/30 text-primary hover:bg-primary/10"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Publish</span>
          </Button>
        )}

        <ProgramPreview
          program={program}
          open={programPreviewOpen}
          onOpenChange={setProgramPreviewOpen}
        />

        {isWorkoutDay && (
          <ExerciseLibrary
            open={exerciseLibraryOpen}
            setOpen={setExerciseLibraryOpen}
            onAdd={addExercise}
            exercises={exercises}
          />
        )}

        <div className="h-6 w-px bg-border mx-1 sm:mx-2" />

        {!user && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open("/help", "_blank")}
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            <ThemeToggle />
          </>
        )}

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
