"use client";

import { Button } from "@/components/ui/button";
import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";
import { ExerciseDetailModal } from "@/features/workout-builder/components/exercises/ExerciseDetailModal";
import type { Exercise } from "@/types/Exercise";
import { Plus } from "lucide-react";
import Image from "next/image";

interface ExerciseCardProps {
  exercise: Exercise;
  onAdd: (exercise: Exercise) => void;
}

export const ExerciseCard = ({ exercise, onAdd }: ExerciseCardProps) => {
  const primaryMuscle = exercise.exercise_muscles?.[0]?.muscles.id;

  return (
    <div className="group rounded-2xl border border-border/80 bg-card shadow-sm transition hover:shadow-md">
      <div
        className="
          grid grid-cols-[auto_1fr_auto] gap-3 p-3 sm:p-4
          items-center
        "
      >
        {/* Image */}
        {exercise.image_url ? (
          <div className="hidden sm:block relative h-20 w-28 shrink-0">
            <Image
              src={exercise.image_url}
              alt={exercise.name}
              fill
              className="rounded object-cover"
              sizes="112px"
            />
          </div>
        ) : (
          <div className="hidden sm:flex h-20 w-28 shrink-0 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
            No image
          </div>
        )}

        {/* Content */}
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold leading-snug">
            {exercise.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {
              MUSCLE_DISPLAY_MAP[
                primaryMuscle as keyof typeof MUSCLE_DISPLAY_MAP
              ]
            }
          </p>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <Button
            size="sm"
            className="h-8 w-8 p-0 rounded"
            aria-label="Add exercise"
            onClick={() => onAdd(exercise)}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <ExerciseDetailModal
            exercise={exercise}
            triggerClassName="bg-background h-8 w-8 p-0 rounded"
          />
        </div>
      </div>
    </div>
  );
};
