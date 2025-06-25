"use client";
import { ExerciseCard } from "@/components/ExerciseCard";
import { WorkoutSummary } from "@/components/WorkoutSummary";
import { EXERCISES } from "@/data/exercises";
import { Exercise, WorkoutExercise } from "@/types/Workout";
import { createWorkoutExercise } from "@/utils/workout";
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
import { ExerciseBuilderCard } from "./ExerciseBuilderCard";
import { ExerciseLibrary } from "./ExerciseLibrary";
import { Button } from "./ui/button";

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

  const addSet = (index: number) => {
    setWorkout((prev) =>
      prev.map((exercise, i) =>
        i === index
          ? {
              ...exercise,
              sets: [...exercise.sets, { reps: 8, weight: 0, rest: 90 }],
            }
          : exercise
      )
    );
  };
  const clearWorkout = () => {
    setWorkout([]);
  };

  const activeExercise = EXERCISES.find((ex) => ex.id === activeId);

  return (
    <div className="">
      <div className="container mx-auto p-6 flex flex gap-6">
        <WorkoutSummary workout={workout} />
        <ExerciseLibrary addExercise={addExercise} />
      </div>

      <div className="container mx-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Available Exercises */}

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
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Start Building Your Workout
                    </h3>
                    <p className="text-gray-500 max-w-sm">
                      Drag exercises from the left panel to create your custom
                      workout routine
                    </p>
                  </div>
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
    </div>
  );
};
