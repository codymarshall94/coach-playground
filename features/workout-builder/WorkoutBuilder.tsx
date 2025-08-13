"use client";

import { Droppable } from "@/components/Droppable";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { WelcomeModal } from "@/components/WelcomeModal";
import { ProgramDaySelector } from "@/features/workout-builder/components/program/ProgramDaySelector";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
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
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Bed, Dumbbell, Plus } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { DayHeader } from "./components/days/DayHeader";
import { ExerciseGroupCard } from "./components/exercises/ExerciseGroupCard";
import { ExerciseSuggestions } from "./components/exercises/ExerciseSuggestions";
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
    addExerciseToGroup,
    moveExerciseByIdToGroup,
    lastAddedIndex,
    setLastAddedIndex,
  } = useWorkoutBuilder(initialProgram);

  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  console.log(program.days?.[0]?.workout);

  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

  useKeyboardShortcuts({
    onNextDay: () => {
      if (activeDayIndex < currentDays.length - 1) {
        setActiveDayIndex(activeDayIndex + 1);
      }
    },
    onPreviousDay: () => {
      if (activeDayIndex > 0) {
        setActiveDayIndex(activeDayIndex - 1);
      }
    },
    onOpenLibrary: () => setExerciseLibraryOpen(true),
    onClearAll: () => {
      const prev = [...exerciseGroups];
      clearWorkout();
      toast("Workout cleared", {
        action: {
          label: "Undo",
          onClick: () => updateDayWorkout(prev),
        },
      });
    },
    onToggleCollapseAll: () =>
      setCollapsedIndex((prev) => (prev === null ? -1 : null)),
    onToggleInsights: () => setAnalyticsOpen((prev) => !prev),
    onSaveDraft: () => handleSave(),
    onPreview: () => setProgramPreviewOpen(true),
    onOpenHelpModal: () => setShowShortcutsModal(true),
  });

  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [exerciseLibraryOpen, setExerciseLibraryOpen] = useState(false);
  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [programPreviewOpen, setProgramPreviewOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(true);
  useEffect(() => {
    if (lastAddedIndex !== null) {
      const group = exerciseGroups[lastAddedIndex];
      const ref = groupRefs.current[group.id];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setLastAddedIndex(null);
    }
  }, [lastAddedIndex, exerciseGroups]);

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
      <WorkoutBuilderHeader
        program={program}
        isSaving={isSaving}
        handleSave={handleSave}
        isWorkoutDay={isWorkoutDay}
        addExercise={(exercise) => {
          addExercise(exercise);
          setLastAddedIndex(exerciseGroups.length);
        }}
        exerciseLibraryOpen={exerciseLibraryOpen}
        setExerciseLibraryOpen={setExerciseLibraryOpen}
        user={user}
        showShortcutsModal={showShortcutsModal}
        setShowShortcutsModal={setShowShortcutsModal}
        programPreviewOpen={programPreviewOpen}
        setProgramPreviewOpen={setProgramPreviewOpen}
      />

      <WelcomeModal
        open={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside className=" border-r border-border bg-muted/20 p-4 space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <ProgramMetaEditor
              program={program}
              onChange={(fields) =>
                setProgram((prev) => ({ ...prev, ...fields }))
              }
              onSwitchMode={(updated) => setProgram(updated)}
            />
          </div>

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
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            <div className="w-full max-w-4xl p-4 mx-auto relative">
              <DayHeader
                day={currentDays[activeDayIndex]}
                exercises={exercises ?? []}
                program={program}
                activeBlockIndex={activeBlockIndex}
                activeDayIndex={activeDayIndex}
                updateDayDetails={updateDayDetails}
                exerciseCount={exerciseGroups.length}
                setCollapsedIndex={setCollapsedIndex}
                collapsedIndex={collapsedIndex}
                clearWorkout={clearWorkout}
                isWorkoutDay={isWorkoutDay}
                exerciseGroups={exerciseGroups}
                insights={insights!}
                analyticsOpen={analyticsOpen}
                setAnalyticsOpen={setAnalyticsOpen}
              />

              {noWorkoutDays ? (
                <div className="mt-6">
                  <span className="px-2 py-1 text-sm font-medium text-muted-foreground rounded-md">
                    {currentDays.length} Days
                  </span>
                </div>
              ) : (
                <Droppable id="workout-drop">
                  {!isWorkoutDay ? (
                    <EmptyState
                      className="w-full mt-6"
                      image={
                        <Image
                          src="/images/empty-states/rest-day.png"
                          alt="Rest Day"
                          width={300}
                          height={300}
                        />
                      }
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
                        title="No Exercises Added"
                        description="Start building your program by adding exercises to this day."
                        image={
                          <Image
                            src="/images/empty-states/no-exercises.png"
                            alt="No Exercises Added"
                            width={300}
                            height={300}
                          />
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
                          <div
                            key={group.id}
                            id={`exercise-group-${group.id}`}
                            ref={(el) => {
                              groupRefs.current[group.id] = el;
                            }}
                          >
                            <ExerciseGroupCard
                              exerciseGroups={exerciseGroups}
                              group={group}
                              groupIndex={groupIndex}
                              exerciseMeta={
                                exercises?.find(
                                  (e) => e.id === group.exercises[0].exercise_id
                                )!
                              }
                              allExercises={exercises || []}
                              isDraggingAny={!!draggingId}
                              collapsedIndex={collapsedIndex}
                              onExpand={() => setCollapsedIndex(groupIndex)}
                              onRemoveExercise={removeExercise}
                              onUpdateSets={updateExerciseSets}
                              onUpdateIntensity={updateExerciseIntensity}
                              onUpdateNotes={updateExerciseNotes}
                              onUpdateGroupType={updateGroupType}
                              onAddExerciseToGroup={addExerciseToGroup}
                              onMoveExerciseByIdToGroup={
                                moveExerciseByIdToGroup
                              }
                            />
                          </div>
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

            <DragOverlay
              dropAnimation={{
                duration: 300,
                easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
              }}
              style={{
                transformOrigin: "0 0",
              }}
            >
              {draggingId && (
                <motion.div
                  initial={{
                    scale: 1,
                    rotate: 0,
                    opacity: 1,
                  }}
                  animate={{
                    scale: 1.05,
                    opacity: 0.95,
                  }}
                  exit={{
                    scale: 0.95,
                    rotate: 0,
                    opacity: 0.8,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="z-[999] pointer-events-none shadow-2xl"
                  style={{
                    filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))",
                  }}
                >
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm" />

                    {/* Main card */}
                    <div className="relative bg-background border-2 border-primary/50 rounded-lg">
                      <ExerciseGroupCard
                        exerciseGroups={exerciseGroups}
                        group={exerciseGroups.find((g) => g.id === draggingId)!}
                        groupIndex={0}
                        exerciseMeta={
                          exercises?.find(
                            (e) =>
                              exerciseGroups.find((g) => g.id === draggingId)
                                ?.exercises[0]?.exercise_id === e.id
                          )!
                        }
                        isDraggingAny={true}
                        collapsedIndex={null}
                        onExpand={() => {}}
                        onRemoveExercise={() => {}}
                        onUpdateSets={() => {}}
                        onUpdateIntensity={() => {}}
                        onUpdateNotes={() => {}}
                        onUpdateGroupType={() => {}}
                        onAddExerciseToGroup={() => {}}
                        onMoveExerciseByIdToGroup={() => {}}
                        allExercises={exercises || []}
                      />
                    </div>

                    {/* Drag indicator */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}
            </DragOverlay>
          </DndContext>
        </main>
      </div>
    </div>
  );
};
