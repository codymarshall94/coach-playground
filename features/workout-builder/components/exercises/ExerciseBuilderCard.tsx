"use client";

import { cn } from "@/lib/utils";
import { Exercise } from "@/types/Exercise";
import { IntensitySystem, WorkoutExercise } from "@/types/Workout";
import { getExerciseETL } from "@/utils/etl";
import { estimateExerciseDuration } from "@/utils/volume/estimateExerciseDuration";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, MotionProps, motion } from "motion/react";
import { CollapsedExerciseCard } from "./CollapsedExerciseCard";
import { ExpandedExerciseCard } from "./ExpandedExerciseCard";

const animationProps: MotionProps = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.2, ease: "easeOut" },
};

export const ExerciseBuilderCard = ({
  order,
  exercise,
  isDraggingAny,
  onRemove,
  onUpdateSets,
  onUpdateIntensity,
  onUpdateNotes,
  collapsed = false,
  onExpand,
  dragging = false,
}: {
  order: number;
  exercise: WorkoutExercise;
  isDraggingAny: boolean;
  onRemove: () => void;
  onUpdateSets: (sets: WorkoutExercise["sets"]) => void;
  onUpdateIntensity: (intensity: IntensitySystem) => void;
  onUpdateNotes: (notes: string) => void;
  collapsed?: boolean;
  onExpand?: () => void;
  dragging?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const exerciseMeta = exercise as unknown as Exercise;
  const { totalETL } = getExerciseETL(exercise, exerciseMeta);
  const durationMin = Math.ceil(estimateExerciseDuration(exercise) / 60);

  const showCollapsed = collapsed || isDraggingAny;

  const renderCollapsed = () => (
    <motion.div key="collapsed" layout {...animationProps}>
      <CollapsedExerciseCard
        order={order}
        exercise={exercise}
        totalETL={totalETL}
        durationMin={durationMin}
        onExpand={onExpand}
        listeners={listeners}
        attributes={attributes}
      />
    </motion.div>
  );

  const renderExpanded = () => (
    <motion.div key="expanded" layout {...animationProps}>
      <ExpandedExerciseCard
        order={order}
        exercise={exercise}
        isDraggingAny={isDraggingAny}
        onRemove={onRemove}
        onUpdateSets={onUpdateSets}
        onUpdateIntensity={onUpdateIntensity}
        onUpdateNotes={onUpdateNotes}
        totalETL={totalETL}
        listeners={listeners}
        attributes={attributes}
      />
    </motion.div>
  );

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className={cn(
        "rounded-xl border bg-background overflow-hidden transition-all",
        dragging && "z-50 scale-[1.01] shadow-xl"
      )}
    >
      <AnimatePresence mode="sync" initial={false}>
        {showCollapsed ? renderCollapsed() : renderExpanded()}
      </AnimatePresence>
    </motion.div>
  );
};
