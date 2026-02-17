"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dumbbell, Plus } from "lucide-react";

import type { Exercise } from "@/types/Exercise";
import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";
import { CATEGORY_DISPLAY_MAP } from "@/constants/movement-category";
import { EQUIPMENT_DISPLAY_MAP } from "@/constants/equipment-list";

type Props = {
  exercise: Exercise;
  onAdd: (exercise: Exercise) => void;
  className?: string;
};

function getPrimaryMuscle(ex: Exercise) {
  if (!ex.exercise_muscles || ex.exercise_muscles.length === 0) return null;
  return ex.exercise_muscles.reduce((best, cur) => {
    const bestContribution = best.contribution ?? 0;
    const curContribution = cur.contribution ?? 0;
    return curContribution > bestContribution ? cur : best;
  }).muscles.display_name;
}

export function ExerciseCard({ exercise, onAdd, className }: Props) {
  const primaryMuscle = getPrimaryMuscle(exercise);

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key.toLowerCase() === "a") onAdd(exercise);
        if (e.key === "Enter") onAdd(exercise);
      }}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl border border-border/70 bg-card/50 p-3 transition hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {/* Thumb */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-muted">
        {exercise.image_url ? (
          <Image
            src={exercise.image_url}
            alt={exercise.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Dumbbell className="h-6 w-6 opacity-70" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold leading-6">
          {exercise.name}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          {CATEGORY_DISPLAY_MAP[
            exercise.category as keyof typeof CATEGORY_DISPLAY_MAP
          ] ?? exercise.category}
          {primaryMuscle && (
            <>
              {" • "}
              {MUSCLE_DISPLAY_MAP[
                primaryMuscle as keyof typeof MUSCLE_DISPLAY_MAP
              ] ?? primaryMuscle}
            </>
          )}
        </p>
      </div>

      {/* Action */}
      <Button
        size="sm"
        onClick={() => onAdd(exercise)}
        aria-label="Add exercise"
        title="Add (A / Enter)"
        className="shadow-sm"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Add
      </Button>
    </div>
  );
}
