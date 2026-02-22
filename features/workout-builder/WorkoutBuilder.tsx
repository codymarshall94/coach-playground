"use client";

import { BuilderLayout } from "./BuilderLayout";

import { Droppable } from "@/components/Droppable";
import { Button } from "@/components/ui/button";
import { WelcomeModal } from "@/components/WelcomeModal";

import {
  buildBlockInputs,
  buildSequence,
  buildSpecFromProgram,
} from "@/engines/core/utils/helpers";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useProgramEngine } from "@/hooks/useProgramEngine";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useUser } from "@/hooks/useUser";
import { useWorkoutBuilder } from "@/hooks/useWorkoutBuilder";
import { getProgramById, saveOrUpdateProgramService } from "@/services/programService";
import { uploadCoverImage } from "@/services/coverImageService";

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

import { Plus, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ScoreDial from "@/components/ScoreDial";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { DayHeader } from "./components/days/DayHeader";
import { NoExercisesEmpty } from "./components/empty-states/NoExercisesEmpty";
import { RestDayEmpty } from "./components/empty-states/RestDayEmpty";
import { ExerciseGroupCard } from "./components/exercises/ExerciseGroupCard";
import { QuickAddSuggestions } from "./components/exercises/QuickAddSuggestions";
import { BlockSelector } from "./components/program/BlockSelector";
import { ProgramCalendarDialog } from "./components/program/ProgramCalendarDialog";
import { ProgramDaySelector } from "./components/program/ProgramDaySelector";
import { ProgramMetaEditor } from "./components/program/ProgramMetaEditor";
import { ProgramOverviewPanel } from "./components/program/ProgramOverview";
import { PublishFlow } from "./components/program/PublishFlow";
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
    activeWeekIndex,
    setActiveWeekIndex,
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
    duplicateTrainingBlock,
    reorderBlocks,
    usingBlocks,
    updateBlockDetails,
    updateDayGroups,
    updateGroupType,
    addExerciseToGroup,
    moveExerciseByIdToGroup,
    lastAddedIndex,
    setLastAddedIndex,
    addWeek,
    removeWeek,
    duplicateWeek,
  } = useWorkoutBuilder(initialProgram);

  // ── Unsaved-changes guard ────────────────────────────────────────
  const savedSnapshotRef = useRef(JSON.stringify(initialProgram ?? {}));
  const isDirty = useMemo(
    () => JSON.stringify(program) !== savedSnapshotRef.current,
    [program]
  );
  const { markClean } = useUnsavedChanges(isDirty);

  const [isSaving, setIsSaving] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [exerciseLibraryOpen, setExerciseLibraryOpen] = useState(false);
  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [programPreviewOpen, setProgramPreviewOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(true);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [publishFlowOpen, setPublishFlowOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pendingCoverFileRef = useRef<File | null>(null);

  const { days, program: programMetrics } = useProgramEngine(
    buildSpecFromProgram(program),
    buildSequence(program, exercises ?? []),
    buildBlockInputs(program, exercises ?? [])
  );

  const handleSave = async () => {
    if (!user) {
      setSavePromptOpen(true);
      return;
    }
    await doSave();
  };

  const doSave = async () => {
    if (isSaving) return;          // guard against double-clicks
    setIsSaving(true);
    try {
      // If the user picked a local cover image, upload it now
      let programToSave = program;
      if (pendingCoverFileRef.current) {
        const url = await uploadCoverImage(pendingCoverFileRef.current, program.id);
        programToSave = { ...program, cover_image: url };
        pendingCoverFileRef.current = null;
      } else if (program.cover_image?.startsWith("blob:")) {
        // Blob URL without a file means it was cleared or lost — strip it
        programToSave = { ...program, cover_image: null };
      }

      const programId = await saveOrUpdateProgramService(programToSave);
      // Sync the DB id back so future saves update instead of inserting
      if (programId !== program.id) {
        programToSave = { ...programToSave, id: programId };
      }

      // Atomically update state and snapshot ref together so isDirty
      // always compares against the exact same object.
      setProgram(() => {
        savedSnapshotRef.current = JSON.stringify(programToSave);
        return programToSave;
      });
      markClean();
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
      const block = program.blocks?.[activeBlockIndex];
      if (!block) return [];
      // Use week-aware days
      if (block.weeks?.length > 0) {
        return block.weeks[activeWeekIndex]?.days ?? block.weeks[0]?.days ?? [];
      }
      return block.days ?? [];
    }
    return program.days ?? [];
  }, [program, activeBlockIndex, activeWeekIndex, usingBlocks]);

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
      hasUnsavedChanges={isDirty}
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
      isSaved={!!initialProgram}
      onPublishClick={() => setPublishFlowOpen(true)}
    />
  );

  const sidebarNode = (
    <div className="flex flex-col gap-3">
      <ProgramMetaEditor
        program={program}
        programScore={programMetrics?.goalFitScore ?? 0}
        onChange={(fields) => setProgram((prev) => ({ ...prev, ...fields }))}
        onSwitchMode={(updated) => setProgram(updated)}
        overviewOpen={overviewOpen}
        hideScore={true}
        onOpenOverview={() => {
          setOverviewOpen(true);
          setActiveDayIndex(null);
        }}
        onPendingCoverFile={(file) => { pendingCoverFileRef.current = file; }}
        onVersionRestored={async () => {
          if (!program.id) return;
          const restored = await getProgramById(program.id);
          if (restored) {
            setProgram(restored);
            savedSnapshotRef.current = JSON.stringify(restored);
            markClean();
          }
        }}
        isSaved={!!initialProgram}
        hasUnsavedChanges={isDirty}
        onOpenPublishFlow={() => setPublishFlowOpen(true)}
      />

      {usingBlocks ? (
        <BlockSelector
          blocks={program.blocks ?? []}
          activeIndex={activeBlockIndex ?? null}
          activeDayIndex={activeDayIndex ?? null}
          activeWeekIndex={activeWeekIndex}
          onSelect={(i) => {
            setActiveBlockIndex(i);
            setActiveWeekIndex(0);
          }}
          onAddBlock={addTrainingBlock}
          onRemoveBlock={(index) => removeTrainingBlock(index)}
          onDuplicateBlock={(index) => duplicateTrainingBlock(index)}
          onReorder={(reordered) => reorderBlocks(reordered)}
          onSelectDay={(i) => {
            setActiveDayIndex(i);
            setOverviewOpen(false);
          }}
          onSelectWeek={(wi) => {
            setActiveWeekIndex(wi);
            setActiveDayIndex(0);
          }}
          onAddWeek={addWeek}
          onRemoveWeek={removeWeek}
          onDuplicateWeek={duplicateWeek}
          onAddWorkoutDay={() => handleAddDay("workout")}
          onAddRestDay={() => handleAddDay("rest")}
          onRemoveWorkoutDay={handleRemoveWorkoutDay}
          onDuplicateWorkoutDay={handleDuplicateWorkoutDay}
          onMoveDay={(from, to) =>
            setProgram((prev) => {
              const blocks = [...(prev.blocks ?? [])];
              const target = blocks[activeBlockIndex];
              if (!target) return prev;
              // Get current week's days for the move
              const weekDays = target.weeks?.[activeWeekIndex]?.days ?? target.days;
              const nextDays = moveDayWithinList(weekDays, from, to, {
                autoRenameDefault: true,
              });
              // Update the specific week
              if (target.weeks?.length > 0) {
                const updatedWeeks = target.weeks.map((w, i) =>
                  i === activeWeekIndex ? { ...w, days: nextDays } : w
                );
                blocks[activeBlockIndex] = { ...target, weeks: updatedWeeks, days: updatedWeeks[0].days };
              } else {
                blocks[activeBlockIndex] = { ...target, days: nextDays };
              }
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

      {/* calendar moved to compact icon bar */}
    </div>
  );

  const iconSidebarNode = (
    <div className="flex flex-col items-center gap-3 py-2">
      <ProgramCalendarDialog
        program={program}
        triggerContent={<CalendarDays className="h-5 w-5" />}
        triggerClassName="h-10 w-10 p-2 rounded-md"
      />
      <div className="pt-1 cursor-pointer" onClick={() => setOverviewOpen(true)}>
        <ScoreDial value={programMetrics?.goalFitScore ?? 0} size={44} thickness={6} />
      </div>
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
    <div suppressHydrationWarning>
      {mounted ? (
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
            <div className="mt-8 flex flex-col items-center gap-4">
              <QuickAddSuggestions
                exerciseGroups={exerciseGroups}
                allExercises={exercises ?? []}
                onAdd={addExercise}
              />
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
      ) : (
        <div className="w-full max-w-4xl p-4 mx-auto relative" />
      )}
    </div>
  );

  return (
    <>
      <BuilderLayout
        header={headerNode}
        sidebar={sidebarNode}
        iconSidebar={iconSidebarNode}
        modals={modalsNode}
      >
        {mainNode}
      </BuilderLayout>

      <AnimatePresence>
        {publishFlowOpen && (
          <PublishFlow
            program={program}
            onPublished={(versionId) => {
              setPublishFlowOpen(false);
              setProgram((prev) => ({
                ...prev,
                is_published: true,
                published_version_id: versionId,
                published_at: new Date(),
              }));
            }}
            onClose={() => setPublishFlowOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
