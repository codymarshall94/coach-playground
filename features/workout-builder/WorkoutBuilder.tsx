"use client";

import { BuilderLayout } from "./BuilderLayout";

import { Droppable } from "@/components/Droppable";
import { Button } from "@/components/ui/button";
import { WelcomeModal } from "@/components/WelcomeModal";

import {
  buildSequence,
  buildSpecFromProgram,
} from "@/engines/core/utils/helpers";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useProgramEngine } from "@/hooks/useProgramEngine";
import { useUser } from "@/hooks/useUser";
import { useWorkoutBuilder } from "@/hooks/useWorkoutBuilder";
import { saveOrUpdateProgramService } from "@/services/programService";

import type { Program } from "@/types/Workout";

import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { VERTICAL_LIST_MODIFIERS } from "@/features/workout-builder/dnd/constants";
import { DragOverlayPortal } from "@/features/workout-builder/dnd/overlay";
import { useSortableSensors } from "@/features/workout-builder/dnd/sensors";
import { useDragAndDrop } from "@/features/workout-builder/hooks/useDragAndDrop";

import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { DayHeader } from "./components/days/DayHeader";
import { NoExercisesEmpty } from "./components/empty-states/NoExercisesEmpty";
import { RestDayEmpty } from "./components/empty-states/RestDayEmpty";
import { ExerciseGroupCard } from "./components/exercises/ExerciseGroupCard";
import { BlockSelector } from "./components/program/BlockSelector";
import { ProgramDaySelector } from "./components/program/ProgramDaySelector";
import { ProgramMetaEditor } from "./components/program/ProgramMetaEditor";
import { ProgramOverviewPanel } from "./components/program/ProgramOverview";
import { SavePromptModal } from "./components/SavePromptModal";
import { WorkoutBuilderHeader } from "./components/WorkoutBuilderHeader";
import { moveDayWithinList } from "./utils/days";

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
    updateDayGroups,
    updateGroupType,
    addExerciseToGroup,
    moveExerciseByIdToGroup,
    lastAddedIndex,
    setLastAddedIndex,
  } = useWorkoutBuilder(initialProgram);

  const [isSaving, setIsSaving] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [exerciseLibraryOpen, setExerciseLibraryOpen] = useState(false);
  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [programPreviewOpen, setProgramPreviewOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(true);
  const [overviewOpen, setOverviewOpen] = useState(false);

  const router = useRouter();
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { days, program: programMetrics } = useProgramEngine(
    buildSpecFromProgram(program),
    buildSequence(program, exercises ?? [])
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

  useKeyboardShortcuts({
    onNextDay: () => {
      if (activeDayIndex !== null && activeDayIndex < currentDays.length - 1) {
        setActiveDayIndex(activeDayIndex + 1);
      }
    },
    onPreviousDay: () => {
      if (activeDayIndex !== null && activeDayIndex > 0) {
        setActiveDayIndex(activeDayIndex - 1);
      }
    },
    onOpenLibrary: () => setExerciseLibraryOpen(true),
    onClearAll: () => {
      const prev = [...exerciseGroups];
      clearWorkout();
      toast("Workout cleared", {
        action: { label: "Undo", onClick: () => updateDayGroups(prev) },
      });
    },
    onToggleCollapseAll: () =>
      setCollapsedIndex((prev) => (prev === null ? -1 : null)),
    onToggleInsights: () => setAnalyticsOpen((prev) => !prev),
    onSaveDraft: () => handleSave(),
    onPreview: () => setProgramPreviewOpen(true),
    onOpenHelpModal: () => setShowShortcutsModal(true),
  });

  useEffect(() => {
    if (lastAddedIndex !== null) {
      const group = exerciseGroups[lastAddedIndex];
      const ref = groupRefs.current[group.id];
      if (ref) ref.scrollIntoView({ behavior: "smooth", block: "center" });
      setLastAddedIndex(null);
    }
  }, [lastAddedIndex, exerciseGroups]);

  const currentDays = useMemo(() => {
    if (usingBlocks && typeof activeBlockIndex === "number") {
      return program.blocks?.[activeBlockIndex]?.days ?? [];
    }
    return program.days ?? [];
  }, [program, activeBlockIndex, usingBlocks]);

  const noWorkoutDays = currentDays.length === 0;

  const sensors = useSortableSensors();
  const { draggingId, handlers, modifiers } = useDragAndDrop({
    items: exerciseGroups,
    onReorder: (next) =>
      updateDayGroups(next.map((g, i) => ({ ...g, order_num: i }))),
    modifiers: VERTICAL_LIST_MODIFIERS,
  });

  const headerNode = (
    <WorkoutBuilderHeader
      program={program}
      isSaving={isSaving}
      handleSave={handleSave}
      isWorkoutDay={isWorkoutDay}
      addExercise={(exercise) => {
        addExercise(exercise);
        setLastAddedIndex(exerciseGroups.length);
      }}
      exercises={exercises ?? []}
      user={user}
      showShortcutsModal={showShortcutsModal}
      setShowShortcutsModal={setShowShortcutsModal}
      programPreviewOpen={programPreviewOpen}
      setProgramPreviewOpen={setProgramPreviewOpen}
      exerciseLibraryOpen={exerciseLibraryOpen}
      setExerciseLibraryOpen={setExerciseLibraryOpen}
    />
  );

  const sidebarNode = (
    <div className="flex flex-col gap-6">
      <ProgramMetaEditor
        program={program}
        programScore={programMetrics?.goalFitScore ?? 0}
        onChange={(fields) => setProgram((prev) => ({ ...prev, ...fields }))}
        onSwitchMode={(updated) => setProgram(updated)}
        overviewOpen={overviewOpen}
        onOpenOverview={() => {
          setOverviewOpen(true);
          setActiveDayIndex(null);
        }}
      />

      {usingBlocks ? (
        <BlockSelector
          blocks={program.blocks ?? []}
          activeIndex={activeBlockIndex ?? null}
          activeDayIndex={activeDayIndex ?? null}
          onSelect={(i) => setActiveBlockIndex(i)}
          onAddBlock={addTrainingBlock}
          onRemoveBlock={(index) => removeTrainingBlock(index)}
          onReorder={(reordered) => reorderBlocks(reordered)}
          onSelectDay={(i) => {
            setActiveDayIndex(i);
            setOverviewOpen(false);
          }}
          onAddWorkoutDay={() => handleAddDay("workout")}
          onAddRestDay={() => handleAddDay("rest")}
          onRemoveWorkoutDay={handleRemoveWorkoutDay}
          onDuplicateWorkoutDay={handleDuplicateWorkoutDay}
          onMoveDay={(from, to) =>
            setProgram((prev) => {
              const blocks = [...(prev.blocks ?? [])];
              const target = blocks[activeBlockIndex];
              if (!target) return prev;
              const nextDays = moveDayWithinList(target.days, from, to, {
                autoRenameDefault: true,
              });
              blocks[activeBlockIndex] = { ...target, days: nextDays };
              return { ...prev, blocks };
            })
          }
          onUpdateBlockDetails={updateBlockDetails}
        />
      ) : (
        <ProgramDaySelector
          days={currentDays}
          activeIndex={activeDayIndex ?? null}
          onSelect={(i) => {
            setActiveDayIndex(i);
            setOverviewOpen(false);
          }}
          onAddWorkoutDay={() => handleAddDay("workout")}
          onAddRestDay={() => handleAddDay("rest")}
          onRemoveWorkoutDay={handleRemoveWorkoutDay}
          onDuplicateWorkoutDay={handleDuplicateWorkoutDay}
          onMove={(from, to) =>
            setProgram((prev) => {
              const days = [...(prev.days ?? [])];
              const nextDays = moveDayWithinList(days, from, to, {
                autoRenameDefault: true,
              });
              return { ...prev, days: nextDays };
            })
          }
        />
      )}
    </div>
  );

  const modalsNode = (
    <>
      <SavePromptModal
        open={savePromptOpen}
        onClose={() => {
          setSavePromptOpen(false);
          setIsSaving(false);
        }}
        onSave={doSave}
      />
      <WelcomeModal
        open={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
      />
    </>
  );

  const mainNode = overviewOpen ? (
    <ProgramOverviewPanel program={program} />
  ) : (
    <DndContext sensors={sensors} {...handlers} modifiers={modifiers}>
      <div className="w-full max-w-4xl p-4 mx-auto relative">
        <DayHeader
          day={currentDays[activeDayIndex ?? 0]}
          dayMetrics={days[activeDayIndex ?? 0]}
          program={program}
          activeBlockIndex={activeBlockIndex}
          activeDayIndex={activeDayIndex || null}
          updateDayDetails={updateDayDetails}
          setCollapsedIndex={setCollapsedIndex}
          collapsedIndex={collapsedIndex}
          clearWorkout={clearWorkout}
          isWorkoutDay={isWorkoutDay}
          exerciseGroups={exerciseGroups}
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {!isWorkoutDay ? (
                <RestDayEmpty />
              ) : exerciseGroups.length === 0 ? (
                <NoExercisesEmpty
                  action={
                    <Button
                      onClick={() => setExerciseLibraryOpen(true)}
                      variant="outline"
                    >
                      Add First Exercise
                    </Button>
                  }
                />
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
                          onUpdateNotes={(groupIndex, notes: string) =>
                            updateExerciseNotes(groupIndex, notes)
                          }
                          onUpdateGroupType={updateGroupType}
                          onAddExerciseToGroup={addExerciseToGroup}
                          onMoveExerciseByIdToGroup={moveExerciseByIdToGroup}
                          exerciseLibraryOpen={exerciseLibraryOpen}
                          setExerciseLibraryOpen={setExerciseLibraryOpen}
                        />
                      </div>
                    ))}
                  </SortableContext>
                </div>
              )}
            </motion.div>
          </Droppable>
        )}

        {isWorkoutDay && exerciseGroups.length > 0 && (
          <>
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => setExerciseLibraryOpen(true)}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
                Browse Exercise Library
              </Button>
            </div>
          </>
        )}
      </div>

      <DragOverlayPortal
        draggingId={draggingId}
        render={(id) => {
          const group = exerciseGroups.find((g) => g.id === id)!;
          const meta = exercises?.find(
            (e) => e.id === group.exercises[0].exercise_id
          )!;
          return (
            <div className="bg-background border-2 border-primary/50 rounded-lg">
              <ExerciseGroupCard
                exerciseGroups={exerciseGroups}
                group={group}
                groupIndex={0}
                exerciseMeta={meta}
                allExercises={exercises || []}
                isDraggingAny
                collapsedIndex={null}
                onExpand={() => {}}
                onRemoveExercise={() => {}}
                onUpdateSets={() => {}}
                onUpdateIntensity={() => {}}
                onUpdateNotes={() => {}}
                exerciseLibraryOpen={exerciseLibraryOpen}
                setExerciseLibraryOpen={setExerciseLibraryOpen}
                onUpdateGroupType={() => {}}
                onAddExerciseToGroup={() => {}}
                onMoveExerciseByIdToGroup={() => {}}
              />
            </div>
          );
        }}
        withHalo
      />
    </DndContext>
  );

  return (
    <BuilderLayout
      header={headerNode}
      sidebar={sidebarNode}
      modals={modalsNode}
    >
      {mainNode}
    </BuilderLayout>
  );
};
