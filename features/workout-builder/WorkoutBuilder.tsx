"use client";

import { Droppable } from "@/components/Droppable";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { ProgramDaySelector } from "@/features/workout-builder/components/program/ProgramDaySelector";
import { useWorkoutBuilder } from "@/hooks/useWorkoutBuilder";
import { saveOrUpdateProgramService } from "@/services/programService";
import { Program } from "@/types/Workout";
import { analyzeWorkoutDay } from "@/utils/analyzeWorkoutDay";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Bed, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DayHeader } from "./components/days/DayHeader";
import { ExerciseBuilderCard } from "./components/exercises/ExerciseBuilderCard";
import { ExerciseCard } from "./components/exercises/ExerciseCard";
import { WorkoutAnalyticsPanel } from "./components/insights/WorkoutAnalyticsPanel";
import { BlockSelector } from "./components/program/BlockSelector";
import { ModeSwitchDialog } from "./components/program/ModeSwitchDialog";
import { ProgramMetaEditor } from "./components/program/ProgramMetaEditor";
import { WorkoutBuilderHeader } from "./components/WorkoutBuilderHeader";

export const WorkoutBuilder = ({
  initialProgram,
}: {
  initialProgram?: Program;
}) => {
  const {
    exercises,
    program,
    setProgram,
    activeDayIndex,
    setActiveDayIndex,
    activeBlockIndex,
    setActiveBlockIndex,
    workout,
    isWorkoutDay,
    updateDayDetails,
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
    removeTrainingBlock,
    reorderBlocks,
    usingBlocks,
    updateBlockDetails,
  } = useWorkoutBuilder(initialProgram);

  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const programId = await saveOrUpdateProgramService(program);
      toast.success("Program saved!");
      router.push(`/programs/${programId}`);
    } catch (err) {
      console.error("❌ Save failed:", err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [exerciseLibraryOpen, setExerciseLibraryOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const activeExercise = exercises?.find((ex) => ex.id === activeId);
  const insights = isWorkoutDay
    ? analyzeWorkoutDay(workout, exercises ?? [])
    : null;

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
      <WorkoutBuilderHeader
        program={program}
        isSaving={isSaving}
        handleSave={handleSave}
        isWorkoutDay={isWorkoutDay}
        addExercise={addExercise}
        exerciseLibraryOpen={exerciseLibraryOpen}
        setExerciseLibraryOpen={setExerciseLibraryOpen}
      />

      {/* MAIN */}
      <div className="p-6 flex-1 space-y-4">
        <ProgramMetaEditor
          name={program.name}
          description={program.description}
          goal={program.goal}
          onChange={(fields) => setProgram((prev) => ({ ...prev, ...fields }))}
        />
        <ModeSwitchDialog
          currentProgram={program}
          onSwitchMode={(updated) => setProgram(updated)}
        />

        {/* BLOCK + DAY SELECTORS */}
        <div className="flex gap-6 mb-4">
          {usingBlocks && (
            <BlockSelector
              blocks={program.blocks ?? []}
              activeIndex={activeBlockIndex}
              activeDayIndex={activeDayIndex}
              onSelect={(i) => setActiveBlockIndex(i)}
              onAddBlock={addTrainingBlock}
              onRemoveBlock={(index) => removeTrainingBlock(index)}
              onReorder={(reordered) => reorderBlocks(reordered)}
              onSelectDay={setActiveDayIndex}
              onAddWorkoutDay={() => handleAddDay("workout")}
              onAddRestDay={() => handleAddDay("rest")}
              onRemoveWorkoutDay={handleRemoveWorkoutDay}
              onDuplicateWorkoutDay={handleDuplicateWorkoutDay}
              onReorderDays={(reordered) =>
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
              onUpdateBlockDetails={updateBlockDetails}
            />
          )}
          {program.mode === "days" && (
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
          )}

          {/* WORKOUT CONTENT */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
          >
            <div className="grid w-full max-w-4xl">
              <div className="flex items-center justify-between mb-6 w-full">
                <div className="w-full">
                  <DayHeader
                    program={program}
                    activeBlockIndex={activeBlockIndex}
                    activeDayIndex={activeDayIndex}
                    editedName={editedName}
                    setEditedName={setEditedName}
                    isEditingName={isEditingName}
                    setIsEditingName={setIsEditingName}
                    updateDayDetails={updateDayDetails}
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
                  <span className="px-2 py-1 text-sm font-medium bg-muted text-muted-foreground rounded-md whitespace-nowrap">
                    {currentDays.length} Days
                  </span>
                </div>
              ) : (
                <Droppable id="workout-drop">
                  {!isWorkoutDay ? (
                    <EmptyState
                      className="w-full"
                      icon={<Bed className="w-10 h-10 text-muted-foreground" />}
                      title="Rest Day"
                      description="You have programmed a rest day for this workout"
                    />
                  ) : workout.length === 0 ? (
                    <EmptyState
                      icon={
                        <Plus className="w-10 h-10 text-muted-foreground" />
                      }
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
                    className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-border hover:border-border hover:bg-muted/50 transition-colors"
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

      {/* <WorkoutFooter workout={workout} /> */}
    </div>
  );
};
