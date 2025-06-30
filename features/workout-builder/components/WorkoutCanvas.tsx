"use client";

import { ProgramDay, WorkoutExercise } from "@/types/Workout";
import { ExerciseBuilderCard } from "@/features/workout-builder/components/ExerciseBuilderCard";
import { EmptyState } from "@/components/EmptyState";
import { Plus, Trash2, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExerciseLibrary } from "@/features/workout-builder/components/ExerciseLibrary";
import { WorkoutAnalyticsPanel } from "./WorkoutAnalyticsPanel";
import { DayHeader } from "./DayHeader";
import { useState } from "react";
import { analyzeWorkoutDay } from "@/utils/analyzeWorkoutDay";

export function WorkoutCanvas({
  day,
  workout,
  isWorkoutDay,
  addExercise,
  removeExercise,
  updateSets,
  updateIntensity,
  updateNotes,
  clearWorkout,
  updateDayName,
}: {
  day: ProgramDay | undefined;
  workout: WorkoutExercise[];
  isWorkoutDay: boolean;
  addExercise: (e: any) => void;
  removeExercise: (index: number) => void;
  updateSets: (index: number, sets: any) => void;
  updateIntensity: (index: number, value: any) => void;
  updateNotes: (index: number, value: string) => void;
  clearWorkout: () => void;
  updateDayName: (name: string) => void;
}) {
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [exerciseLibraryOpen, setExerciseLibraryOpen] = useState(false);

  if (!day) return null;

  const insights = isWorkoutDay ? analyzeWorkoutDay(workout) : null;

  return (
    <div className="mt-8">
      <DayHeader
        program={null as any}
        activeDayIndex={0}
        editedName={day.name}
        setEditedName={() => {}}
        isEditingName={false}
        setIsEditingName={() => {}}
        updateDayName={updateDayName}
        updateDayDescription={() => {}}
        exerciseCount={workout.length}
      />

      {isWorkoutDay && workout.length > 0 && (
        <div className="flex items-center gap-2 mt-4">
          <WorkoutAnalyticsPanel
            workout={workout}
            summary={insights!}
            open={analyticsOpen}
            setOpen={setAnalyticsOpen}
          />
          <Button onClick={clearWorkout} variant="outline" size="sm">
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      )}

      <div className="mt-6">
        {!isWorkoutDay ? (
          <EmptyState
            icon={<Bed className="w-10 h-10 text-gray-400" />}
            title="Rest Day"
            description="You have programmed a rest day for this workout"
          />
        ) : workout.length === 0 ? (
          <EmptyState
            icon={<Plus className="w-10 h-10 text-gray-400" />}
            title="Start Building Your Workout"
            description="Open the exercise library to add exercises"
          />
        ) : (
          <div className="space-y-3">
            {workout.map((exercise, index) => (
              <ExerciseBuilderCard
                key={`${exercise.id}-${index}`}
                order={index}
                exercise={exercise}
                onRemove={() => removeExercise(index)}
                onUpdateSets={(sets) => updateSets(index, sets)}
                onUpdateIntensity={(intensity) =>
                  updateIntensity(index, intensity)
                }
                onUpdateNotes={(notes) => updateNotes(index, notes)}
              />
            ))}
          </div>
        )}
      </div>

      {isWorkoutDay && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => setExerciseLibraryOpen(true)}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
            Add Exercise
          </Button>
          <ExerciseLibrary
            open={exerciseLibraryOpen}
            setOpen={setExerciseLibraryOpen}
            addExercise={addExercise}
          />
        </div>
      )}
    </div>
  );
}
