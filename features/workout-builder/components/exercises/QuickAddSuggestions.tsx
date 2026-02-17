"use client";

import { Button } from "@/components/ui/button";
import type { Exercise } from "@/types/Exercise";
import type { WorkoutExerciseGroup } from "@/types/Workout";
import {
  suggestExercises,
  type SuggestedExercise,
} from "@/utils/exercises/suggestExercises";
import { CATEGORY_DISPLAY_MAP } from "@/constants/movement-category";
import { Plus, Sparkles } from "lucide-react";
import { memo, useMemo } from "react";

interface QuickAddSuggestionsProps {
  exerciseGroups: WorkoutExerciseGroup[];
  allExercises: Exercise[];
  onAdd: (exercise: Exercise) => void;
}

export const QuickAddSuggestions = memo(function QuickAddSuggestions({
  exerciseGroups,
  allExercises,
  onAdd,
}: QuickAddSuggestionsProps) {
  const suggestions = useMemo(
    () => suggestExercises(exerciseGroups, allExercises, 3),
    [exerciseGroups, allExercises]
  );

  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3" />
        <span>Suggested for this workout</span>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <SuggestionChip key={s.exercise.id} suggestion={s} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
});

const SuggestionChip = memo(function SuggestionChip({
  suggestion,
  onAdd,
}: {
  suggestion: SuggestedExercise;
  onAdd: (exercise: Exercise) => void;
}) {
  const { exercise, reason } = suggestion;
  const categoryLabel =
    CATEGORY_DISPLAY_MAP[exercise.category] ?? exercise.category;

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-auto py-1.5 px-3 gap-1.5 text-xs font-normal border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
      onClick={() => onAdd(exercise)}
    >
      <Plus className="h-3 w-3 text-muted-foreground" />
      <span className="font-medium">{exercise.name}</span>
      <span className="text-muted-foreground">·</span>
      <span className="text-muted-foreground">{reason}</span>
    </Button>
  );
});
