"use client";

import { Droppable } from "@/components/Droppable";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { ProgramDaySelector } from "@/features/workout-builder/components/program/ProgramDaySelector";
import { useUser } from "@/hooks/useUser";
import { useWorkoutBuilder } from "@/hooks/useWorkoutBuilder";
import { saveOrUpdateProgramService } from "@/services/programService";
import { Program } from "@/types/Workout";
import { analyzeWorkoutDay } from "@/utils/analyzeWorkoutDay";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Bed, Dumbbell, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { createRef, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DayHeader } from "./components/days/DayHeader";
import { ExerciseGroupCard } from "./components/exercises/ExerciseGroupCard";
import { ExerciseSuggestions } from "./components/exercises/ExerciseSuggestions";
import { WorkoutAnalyticsPanel } from "./components/insights/WorkoutAnalyticsPanel";
import { BlockSelector } from "./components/program/BlockSelector";
import { ProgramMetaEditor } from "./components/program/ProgramMetaEditor";
import { SavePromptModal } from "./components/SavePromptModal";
import { WorkoutBuilderHeader } from "./components/WorkoutBuilderHeader";

export const WorkoutBuilder = ({
  initialProgram,
}: {
  initialProgram?: Program;
}) => {
  const { user } = useUser();
  const {
    exercises,
    program,
    setProgram,
    activeDayIndex,
    setActiveDayIndex,
    activeBlockIndex,
    setActiveBlockIndex,
    exerciseGroups,
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
    updateDayWorkout,
    updateGroupType,
    updateGroupRest,
    addExerciseToGroup,
    moveExerciseToGroup,
    targetGroupIndex,
    setTargetGroupIndex,
    moveExerciseByIdToGroup,
  } = useWorkoutBuilder(initialProgram);

  const [isSaving, setIsSaving] = useState(false);
  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);

  const router = useRouter();

  const groupRefs = useMemo(
    () => exerciseGroups.map(() => createRef<HTMLDivElement>()),
    [exerciseGroups.length]
  );

  const handleSave = async () => {
    if (!user) {
      setSavePromptOpen(true);
      return;
    }

    await doSave();
  };

  const doSave = async () => {
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

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [exerciseLibraryOpen, setExerciseLibraryOpen] = useState(false);
  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lastAddedIndex !== null && groupRefs[lastAddedIndex]?.current) {
      groupRefs[lastAddedIndex]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setLastAddedIndex(null);
    }
  }, [lastAddedIndex, groupRefs]);

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingId(event.active.id as string);
  };

  const insights = isWorkoutDay
    ? analyzeWorkoutDay(exerciseGroups, exercises ?? [])
    : null;

  const currentDays = useMemo(() => {
    if (usingBlocks && typeof activeBlockIndex === "number") {
      return program.blocks?.[activeBlockIndex]?.days ?? [];
    }
    return program.days ?? [];
  }, [program, activeBlockIndex, usingBlocks]);

  const handleDragEndExerciseGroup = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggingId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = exerciseGroups.findIndex((g) => g.id === active.id);
    const newIndex = exerciseGroups.findIndex((g) => g.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(exerciseGroups, oldIndex, newIndex).map(
      (group, index) => ({
        ...group,
        order_num: index,
      })
    );

    updateDayWorkout(reordered);
  };

  const noWorkoutDays = currentDays.length === 0;

  return (
    <div className="flex flex-col h-screen">
      <SavePromptModal
        open={savePromptOpen}
        onClose={() => {
          setSavePromptOpen(false);
          setIsSaving(false);
        }}
        onSave={doSave}
      />
      {/* HEADER */}
      <WorkoutBuilderHeader
        program={program}
        isSaving={isSaving}
        handleSave={handleSave}
        isWorkoutDay={isWorkoutDay}
        addExercise={addExercise}
        exerciseLibraryOpen={exerciseLibraryOpen}
        setExerciseLibraryOpen={setExerciseLibraryOpen}
        user={user}
      />

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL – Settings & Day Selector */}
        <aside className=" border-r border-border bg-muted/20 p-4 space-y-6 overflow-y-auto">
          {/* Program Settings */}
          <div className="space-y-4">
            <ProgramMetaEditor
              program={program}
              onChange={(fields) =>
                setProgram((prev) => ({ ...prev, ...fields }))
              }
              onSwitchMode={(updated) => setProgram(updated)}
            />
          </div>

          {/* Day/Block Selector */}
          <div className="pt-4 border-t border-border">
            {usingBlocks ? (
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
                    const blocks = [...(prev.blocks ?? [])];
                    blocks[activeBlockIndex].days = reordered;
                    return { ...prev, blocks };
                  })
                }
                onUpdateBlockDetails={updateBlockDetails}
              />
            ) : (
              <ProgramDaySelector
                days={currentDays}
                activeIndex={activeDayIndex}
                onSelect={setActiveDayIndex}
                onAddWorkoutDay={() => handleAddDay("workout")}
                onAddRestDay={() => handleAddDay("rest")}
                onRemoveWorkoutDay={handleRemoveWorkoutDay}
                onDuplicateWorkoutDay={handleDuplicateWorkoutDay}
                onReorder={(reordered) =>
                  setProgram((prev) => ({ ...prev, days: reordered }))
                }
              />
            )}
          </div>
        </aside>

        <main className="flex-1  overflow-y-auto">
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={(event) => {
              handleDragEndExerciseGroup(event);
            }}
            onDragCancel={() => setDraggingId(null)}
          >
            <div className="w-full max-w-4xl mx-auto relative">
              <DayHeader
                program={program}
                activeBlockIndex={activeBlockIndex}
                activeDayIndex={activeDayIndex}
                editedName={editedName}
                setEditedName={setEditedName}
                isEditingName={isEditingName}
                setIsEditingName={setIsEditingName}
                updateDayDetails={updateDayDetails}
                exerciseCount={exerciseGroups.length}
                setCollapsedIndex={setCollapsedIndex}
                collapsedIndex={collapsedIndex}
                clearWorkout={clearWorkout}
              />
              {isWorkoutDay && exerciseGroups.length > 0 && (
                <div className="flex justify-between items-center mt-2 mb-2 px-1">
                  <div className="flex gap-2">
                    <WorkoutAnalyticsPanel
                      workout={exerciseGroups}
                      summary={insights!}
                      open={analyticsOpen}
                      setOpen={setAnalyticsOpen}
                    />
                  </div>
                </div>
              )}

              {noWorkoutDays ? (
                <div className="mt-6">
                  <span className="px-2 py-1 text-sm font-medium bg-muted text-muted-foreground rounded-md">
                    {currentDays.length} Days
                  </span>
                </div>
              ) : (
                <Droppable id="workout-drop">
                  {!isWorkoutDay ? (
                    <EmptyState
                      className="w-full mt-6"
                      icon={<Bed className="w-10 h-10 text-muted-foreground" />}
                      title="Rest Day"
                      description="You have programmed a rest day for this workout"
                    />
                  ) : exerciseGroups.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <EmptyState
                        title="No Workouts Added"
                        description="Start building your program by adding exercises or rest days."
                        icon={
                          <Dumbbell className="w-10 h-10 text-muted-foreground" />
                        }
                        action={
                          <Button
                            onClick={() => setExerciseLibraryOpen(true)}
                            variant="outline"
                            size="sm"
                          >
                            Add First Exercise
                          </Button>
                        }
                        center
                      />
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <SortableContext
                        items={exerciseGroups.map((e) => e.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {exerciseGroups.map((group, groupIndex) => (
                          <ExerciseGroupCard
                            key={group.id}
                            exerciseGroups={exerciseGroups}
                            group={group}
                            groupIndex={groupIndex}
                            isDraggingAny={!!draggingId}
                            collapsedIndex={collapsedIndex}
                            onExpand={() => setCollapsedIndex(groupIndex)}
                            onRemoveExercise={removeExercise}
                            onUpdateSets={updateExerciseSets}
                            onUpdateIntensity={updateExerciseIntensity}
                            onUpdateNotes={updateExerciseNotes}
                            onUpdateGroupType={updateGroupType}
                            onUpdateGroupRest={updateGroupRest}
                            onAddExerciseToGroup={addExerciseToGroup}
                            targetGroupIndex={targetGroupIndex}
                            setTargetGroupIndex={setTargetGroupIndex}
                            onMoveExerciseToGroup={moveExerciseToGroup}
                            onMoveExerciseByIdToGroup={moveExerciseByIdToGroup}
                          />
                        ))}
                      </SortableContext>
                    </div>
                  )}
                </Droppable>
              )}

              {isWorkoutDay && exerciseGroups.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={() => setExerciseLibraryOpen(true)}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4" />
                    Browse Exercise Library
                  </Button>
                </div>
              )}
              {isWorkoutDay && exerciseGroups.length > 0 && (
                <ExerciseSuggestions
                  workout={currentDays}
                  allExercises={exercises ?? []}
                  onAddExercise={addExercise}
                />
              )}
            </div>

            <DragOverlay dropAnimation={{ duration: 200, easing: "ease-out" }}>
              {draggingId && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0.7 }}
                  animate={{ scale: 1.02, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="z-[999] pointer-events-none"
                >
                  <ExerciseGroupCard
                    exerciseGroups={exerciseGroups}
                    group={exerciseGroups.find((g) => g.id === draggingId)!}
                    groupIndex={0}
                    isDraggingAny={true}
                    collapsedIndex={null}
                    onExpand={() => {}}
                    onRemoveExercise={() => {}}
                    onUpdateSets={() => {}}
                    onUpdateIntensity={() => {}}
                    onUpdateNotes={() => {}}
                    onUpdateGroupType={() => {}}
                    onUpdateGroupRest={() => {}}
                    onAddExerciseToGroup={() => {}}
                    targetGroupIndex={null}
                    setTargetGroupIndex={() => {}}
                    onMoveExerciseToGroup={() => {}}
                    onMoveExerciseByIdToGroup={() => {}}
                  />
                </motion.div>
              )}
            </DragOverlay>
          </DndContext>
        </main>
      </div>
    </div>
  );
};
