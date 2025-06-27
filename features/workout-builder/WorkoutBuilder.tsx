"use client";

import { Droppable } from "@/components/Droppable";
import { EmptyState } from "@/components/EmptyState";
import { ExerciseCard } from "@/features/workout-builder/components/ExerciseCard";
import { Logo } from "@/components/Logo";
import { ProgramDaySelector } from "@/features/workout-builder/components/ProgramDaySelector";
import { QuickStatsBar } from "@/features/workout-builder/components/QuickStatsBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkoutFooter } from "@/features/workout-builder/components/WorkoutFooter";
import { WorkoutSummary } from "@/features/workout-builder/components/WorkoutSummary";
import { EXERCISES } from "@/data/exercises";
import { ExerciseBuilderCard } from "@/features/workout-builder/components/ExerciseBuilderCard";
import { ExerciseLibrary } from "@/features/workout-builder/components/ExerciseLibrary";
import { useWorkoutBuilder } from "@/hooks/useWorkoutBuilder";
import { getExerciseDetails } from "@/utils/getExerciseDetails";
import { calculateWorkoutSummary } from "@/utils/workout-summary";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Bed, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

export const WorkoutBuilder = () => {
  const {
    program,
    activeDayIndex,
    workout,
    setActiveDayIndex,
    setProgram,
    updateDayName,
    handleAddDay,
    handleRemoveWorkoutDay,
    handleDuplicateWorkoutDay,
    addExercise,
    removeExercise,
    updateExerciseSets,
    updateExerciseIntensity,
    clearWorkout,
  } = useWorkoutBuilder();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
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
          {program.days[activeDayIndex].type === "workout" && (
            <ExerciseLibrary addExercise={addExercise} />
          )}
        </div>
      </header>

      <QuickStatsBar summary={summary} />

      <div className="p-6 flex-1">
        <div className="flex gap-6 mb-4">
          <ProgramDaySelector
            days={program.days}
            activeIndex={activeDayIndex}
            onSelect={(index) => setActiveDayIndex(index)}
            onRemoveWorkoutDay={handleRemoveWorkoutDay}
            onDuplicateWorkoutDay={handleDuplicateWorkoutDay}
            onAddWorkoutDay={() => handleAddDay("workout")}
            onAddRestDay={() => handleAddDay("rest")}
            onReorder={(reordered) => {
              setProgram((prev) => ({
                ...prev,
                days: reordered,
              }));
            }}
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
          >
            <div className="grid  gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  {activeDayIndex !== null && program && (
                    <div className="flex items-center gap-2">
                      {isEditingName ? (
                        <>
                          <Input
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="text-2xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
                            placeholder="Day Name"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                updateDayName(
                                  editedName.trim() || "Untitled Day"
                                );
                                setIsEditingName(false);
                              }
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              updateDayName(
                                editedName.trim() || "Untitled Day"
                              );
                              setIsEditingName(false);
                            }}
                          >
                            <Check className="w-5 h-5 text-green-600 hover:text-green-700" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditingName(false)}
                          >
                            <X className="w-5 h-5 text-red-500 hover:text-red-600" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {program?.days[activeDayIndex].name}
                          </h2>
                          <Pencil
                            className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-black"
                            onClick={() => {
                              setEditedName(program.days[activeDayIndex].name);
                              setIsEditingName(true);
                            }}
                          />
                        </>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-md whitespace-nowrap">
                          {workout.length}{" "}
                          {workout.length === 1 ? "Exercise" : "Exercises"}
                        </span>
                      </div>
                    </div>
                  )}

                  {workout.length > 0 && (
                    <Button onClick={clearWorkout} variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </Button>
                  )}
                </div>

                <Droppable id="workout-drop">
                  {program.days[activeDayIndex]?.type === "rest" ? (
                    <EmptyState
                      className="w-full"
                      icon={<Bed className="w-10 h-10 text-gray-400" />}
                      title="Rest Day"
                      description="You have programmed a rest day for this workout"
                    />
                  ) : workout.length === 0 ? (
                    <EmptyState
                      icon={<Plus className="w-10 h-10 text-gray-400" />}
                      title="Start Building Your Workout"
                      description="Open the exercise library to add exercises to your workout"
                    />
                  ) : (
                    <div className="space-y-3">
                      {workout.map((exercise, index) => (
                        <ExerciseBuilderCard
                          key={`${exercise.id}-${index}`}
                          order={index}
                          exercise={exercise}
                          onRemove={() => removeExercise(index)}
                          onUpdateSets={(sets) =>
                            updateExerciseSets(index, sets)
                          }
                          onUpdateIntensity={(intensity) =>
                            updateExerciseIntensity(index, intensity)
                          }
                        />
                      ))}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* <WorkoutInsightsPanel workout={workout} /> */}
            </div>

            <DragOverlay>
              {activeExercise && (
                <div className="transform rotate-2 scale-105">
                  <ExerciseCard
                    exercise={activeExercise}
                    onAdd={() => addExercise(activeExercise)}
                  />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      <WorkoutFooter workout={workout} />
    </div>
  );
};
