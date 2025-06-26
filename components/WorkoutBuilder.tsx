"use client";
import { ExerciseCard } from "@/components/ExerciseCard";
import { WorkoutSummary } from "@/components/WorkoutSummary";
import { EXERCISES } from "@/data/exercises";
import { Exercise, WorkoutExercise } from "@/types/Workout";
import { getExerciseDetails } from "@/utils/getExerciseDetails";
import { createWorkoutExercise } from "@/utils/workout";
import { calculateWorkoutSummary } from "@/utils/workout-summary";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Droppable } from "./Droppable";
import { EmptyState } from "./EmptyState";
import { ExerciseBuilderCard } from "./ExerciseBuilderCard";
import { ExerciseLibrary } from "./ExerciseLibrary";
import { Logo } from "./Logo";
import { QuickStatsBar } from "./QuickStatsBar";
import { Button } from "./ui/button";
import { WorkoutFooter } from "./WorkoutFooter";
import { WorkoutInsightsPanel } from "./WorkoutInsights";

export const WorkoutBuilder = () => {
  const [workout, setWorkout] = useState<WorkoutExercise[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const addExercise = (exercise: Exercise) => {
    setWorkout((prev) => [...prev, createWorkoutExercise(exercise)]);
  };

  const removeExercise = (index: number) => {
    setWorkout((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExerciseSets = (index: number, sets: WorkoutExercise["sets"]) => {
    setWorkout((prev) =>
      prev.map((exercise, i) =>
        i === index ? { ...exercise, sets } : exercise
      )
    );
  };

  const clearWorkout = () => {
    setWorkout([]);
  };

  const activeExercise = EXERCISES.find((ex) => ex.id === activeId);

  const fullExercises = getExerciseDetails(workout);

  const summary = calculateWorkoutSummary(fullExercises);

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
        <Logo size="xs" lineBreak={false} />
        <div className="flex gap-2">
          <WorkoutSummary workout={workout} summary={summary} />
          <ExerciseLibrary addExercise={addExercise} />
          {/* <SettingsPopover /> */}
          {/* <Button variant="default" className="bg-blue-600 text-white">
            Save Workout
          </Button> */}
        </div>
      </header>
      <QuickStatsBar summary={summary} />

      <div className="container mx-auto p-6 flex-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Workout Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Plus className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Workout
                  </h2>
                  {workout.length > 0 && (
                    <span className="px-2 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                      {workout.length}
                    </span>
                  )}
                </div>

                {workout.length > 0 && (
                  <Button onClick={clearWorkout} variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </Button>
                )}
              </div>

              <Droppable id="workout-drop">
                {workout.length === 0 ? (
                  <EmptyState
                    icon={<Plus className="w-10 h-10 text-gray-400" />}
                    title="Start Building Your Workout"
                    description="Open the exercise library to add exercises to your workout"
                  />
                ) : (
                  <div className="space-y-3">
                    {workout.map((exercise, index) => (
                      <ExerciseBuilderCard
                        order={index}
                        exercise={exercise}
                        onRemove={() => removeExercise(index)}
                        onUpdateSets={(sets) => updateExerciseSets(index, sets)}
                        key={`${exercise.id}-${index}`}
                      />
                    ))}
                  </div>
                )}
              </Droppable>
            </div>
            <WorkoutInsightsPanel workout={workout} />
          </div>

          <DragOverlay>
            {activeExercise ? (
              <div className="transform rotate-2 scale-105">
                <ExerciseCard
                  exercise={activeExercise}
                  onAdd={() => addExercise(activeExercise)}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      <WorkoutFooter workout={workout} onSave={() => {}} />
    </div>
  );
};
