"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";

import { Bed, Plus, Trash2 } from "lucide-react";

import { Droppable } from "@/components/Droppable";
import { EmptyState } from "@/components/EmptyState";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

import { EXERCISES } from "@/data/exercises";
import { ExerciseBuilderCard } from "@/features/workout-builder/components/ExerciseBuilderCard";
import { ExerciseCard } from "@/features/workout-builder/components/ExerciseCard";
import { ExerciseLibrary } from "@/features/workout-builder/components/ExerciseLibrary";
import { ProgramDaySelector } from "@/features/workout-builder/components/ProgramDaySelector";
import { WorkoutFooter } from "@/features/workout-builder/components/WorkoutFooter";
import { useWorkoutBuilder } from "@/hooks/useWorkoutBuilder";
import { analyzeWorkoutDay } from "@/utils/analyzeWorkoutDay";
import { DayHeader } from "./components/DayHeader";
import { ProgramMetaEditor } from "./components/ProgramMetaEditor";
import { ProgramPreview } from "./components/ProgramPreview";
import { WorkoutAnalyticsPanel } from "./components/WorkoutAnalyticsPanel";
import { BlockSelector } from "./components/BlockSelector";

export const WorkoutBuilder = () => {
  const {
    program,
    setProgram,
    activeDayIndex,
    setActiveDayIndex,
    activeBlockIndex,
    setActiveBlockIndex,
    workout,
    isWorkoutDay,
    updateDayName,
    handleAddDay,
    handleRemoveWorkoutDay,
    handleDuplicateWorkoutDay,
    addExercise,
    removeExercise,
    updateExerciseSets,
    updateExerciseIntensity,
    clearWorkout,
    updateExerciseNotes,
    addTrainingBlock,
    usingBlocks,
  } = useWorkoutBuilder();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [exerciseLibraryOpen, setExerciseLibraryOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const activeExercise = EXERCISES.find((ex) => ex.id === activeId);
  const insights = isWorkoutDay ? analyzeWorkoutDay(workout) : null;

  const currentDays = useMemo(() => {
    if (usingBlocks && typeof activeBlockIndex === "number") {
      return program.blocks?.[activeBlockIndex]?.days ?? [];
    }
    return program.days ?? [];
  }, [program, activeBlockIndex, usingBlocks]);

  const noWorkoutDays = currentDays.length === 0;

  return (
    <div className="flex flex-col h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
        <Logo size="xs" lineBreak={false} />
        <div className="flex gap-2">
          {isWorkoutDay && (
            <ExerciseLibrary
              addExercise={addExercise}
              open={exerciseLibraryOpen}
              setOpen={setExerciseLibraryOpen}
            />
          )}
          <ProgramPreview program={program} />
        </div>
      </header>

      {/* MAIN */}
      <div className="p-6 flex-1 space-y-4">
        <ProgramMetaEditor
          name={program.name}
          description={program.description}
          goal={program.goal}
          onChange={(fields) => setProgram((prev) => ({ ...prev, ...fields }))}
        />

        <Button onClick={addTrainingBlock}>
          <Plus className="w-4 h-4" />
          Add Block
        </Button>

        {/* BLOCK + DAY SELECTORS */}
        <div className="flex gap-6 mb-4">
          {usingBlocks && (
            <BlockSelector
              blocks={program.blocks ?? []}
              activeIndex={activeBlockIndex}
              onSelect={(i) => setActiveBlockIndex(i)}
              onAddBlock={addTrainingBlock}
              onRemoveBlock={(index) =>
                setProgram((prev) => ({
                  ...prev,
                  blocks: prev.blocks!.filter((_, i) => i !== index),
                }))
              }
              onRenameBlock={(index, name) =>
                setProgram((prev) => {
                  const updated = [...(prev.blocks ?? [])];
                  updated[index].name = name;
                  return { ...prev, blocks: updated };
                })
              }
              onReorder={(reordered) =>
                setProgram((prev) => ({ ...prev, blocks: reordered }))
              }
            />
          )}

          <ProgramDaySelector
            days={currentDays}
            activeIndex={activeDayIndex}
            onSelect={setActiveDayIndex}
            onAddWorkoutDay={() => handleAddDay("workout")}
            onAddRestDay={() => handleAddDay("rest")}
            onRemoveWorkoutDay={handleRemoveWorkoutDay}
            onDuplicateWorkoutDay={handleDuplicateWorkoutDay}
            onReorder={(reordered) =>
              setProgram((prev) => {
                if (usingBlocks && typeof activeBlockIndex === "number") {
                  const blocks = [...(prev.blocks ?? [])];
                  blocks[activeBlockIndex].days = reordered;
                  return { ...prev, blocks };
                } else {
                  return { ...prev, days: reordered };
                }
              })
            }
          />

          {/* WORKOUT CONTENT */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
          >
            <div className="grid w-full">
              <div className="flex items-center justify-between mb-6 w-full">
                <div className="w-full">
                  <DayHeader
                    program={program}
                    activeDayIndex={activeDayIndex}
                    editedName={editedName}
                    setEditedName={setEditedName}
                    isEditingName={isEditingName}
                    setIsEditingName={setIsEditingName}
                    updateDayName={updateDayName}
                    updateDayDescription={(desc) =>
                      setProgram((prev) => {
                        if (usingBlocks) {
                          const blocks = [...(prev.blocks ?? [])];
                          const days = blocks[activeBlockIndex].days.map(
                            (d, i) =>
                              i === activeDayIndex
                                ? { ...d, description: desc }
                                : d
                          );
                          blocks[activeBlockIndex].days = days;
                          return { ...prev, blocks };
                        }
                        const days = prev.days!.map((d, i) =>
                          i === activeDayIndex ? { ...d, description: desc } : d
                        );
                        return { ...prev, days };
                      })
                    }
                    exerciseCount={workout.length}
                  />

                  {workout.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <WorkoutAnalyticsPanel
                        workout={workout}
                        summary={insights!}
                        open={analyticsOpen}
                        setOpen={setAnalyticsOpen}
                      />
                      <Button
                        onClick={clearWorkout}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {noWorkoutDays ? (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-md whitespace-nowrap">
                    {currentDays.length} Days
                  </span>
                </div>
              ) : (
                <Droppable id="workout-drop">
                  {!isWorkoutDay ? (
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
                          onUpdateNotes={(notes) =>
                            updateExerciseNotes(index, notes)
                          }
                        />
                      ))}
                    </div>
                  )}
                </Droppable>
              )}

              {isWorkoutDay && (
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={() => setExerciseLibraryOpen(true)}
                    variant="outline"
                    className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Exercise
                  </Button>
                </div>
              )}
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
