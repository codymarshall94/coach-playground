"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Exercise } from "@/types/Exercise";
import type { ProgramDay } from "@/types/Workout";
import { getSmartExerciseSuggestions } from "@/utils/exercises/getSmartExerciseSuggestions";
import { Dumbbell, Plus, X } from "lucide-react";
import { AnimatePresence, motion, Variants } from "motion/react";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

const panelVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transformOrigin: "bottom right",
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
};

const badgeVariants: Variants = {
  hidden: { scale: 0 },
  visible: { scale: 1 },
  exit: { scale: 0 },
};

const SuggestionItem = memo(
  ({
    exercise,
    onAdd,
  }: {
    exercise: Exercise;
    onAdd: (exercise: Exercise) => void;
  }) => {
    const handleClick = useCallback(() => onAdd(exercise), [exercise, onAdd]);

    return (
      <li className="flex justify-between items-center py-1.5 px-1 rounded hover:bg-muted/50 transition-colors duration-150">
        <span className="text-sm truncate mr-2 flex-1">{exercise.name}</span>
        <Button
          onClick={handleClick}
          size="sm"
          variant="secondary"
          className="shrink-0 h-7 px-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </li>
    );
  }
);

SuggestionItem.displayName = "SuggestionItem";

type Props = {
  workout: ProgramDay[];
  allExercises: Exercise[];
  onAddExercise: (exercise: Exercise) => void;
};

export function ExerciseSuggestions({
  workout,
  allExercises,
  onAddExercise,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setOpen(false));

  const suggestions = useMemo(
    () =>
      getSmartExerciseSuggestions({ currentWorkout: workout, allExercises }),
    [workout, allExercises]
  );

  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);

  const handleAddExercise = useCallback(
    (exercise: Exercise) => {
      onAddExercise(exercise);
    },
    [onAddExercise]
  );

  if (suggestions.length === 0) return null;

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50">
      <motion.button
        onClick={toggleOpen}
        className="relative w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          mass: 0.8,
        }}
        aria-label={open ? "Close suggestions" : "Open exercise suggestions"}
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {open ? (
            <X className="w-5 h-5 rotate-45" />
          ) : (
            <Dumbbell className="w-5 h-5" />
          )}
        </motion.div>

        <AnimatePresence>
          {!open && (
            <motion.span
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.15 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center"
            >
              {suggestions.length}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-16 right-0"
          >
            <Card className="w-[320px] shadow-2xl border bg-background/95 backdrop-blur-sm">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold">Exercise Suggestions</h4>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {suggestions.length} exercise
                    {suggestions.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Add exercises to your current workout day.
                </p>

                <div className="max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                  <ul className="space-y-1">
                    {suggestions.map(({ exercise }) => (
                      <SuggestionItem
                        key={exercise.id}
                        exercise={exercise}
                        onAdd={handleAddExercise}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
