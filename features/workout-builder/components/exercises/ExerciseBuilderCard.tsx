"use client";

import { Exercise } from "@/types/Exercise";
import { IntensitySystem, WorkoutExercise } from "@/types/Workout";
import { getExerciseETL } from "@/utils/etl";
import { estimateExerciseDuration } from "@/utils/volume/estimateExerciseDuration";
import { AnimatePresence, MotionProps, motion } from "motion/react";
import { CollapsedExerciseCard } from "./CollapsedExerciseCard";
import { ExpandedExerciseCard } from "./ExpandedExerciseCard";

const animationProps: MotionProps = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.2, ease: "easeOut" },
};

type Props = {
  order: number;
  onlyExercise: boolean;
  exercise: WorkoutExercise;
  exerciseMeta: Exercise;
  isDraggingAny: boolean;
  onRemove: () => void;
  onUpdateSets: (sets: WorkoutExercise["sets"]) => void;
  onUpdateIntensity: (intensity: IntensitySystem) => void;
  onUpdateNotes: (notes: string) => void;
  collapsed?: boolean;
  onExpand?: () => void;
  dragging?: boolean;
};

export const ExerciseBuilderCard = ({
  order,
  onlyExercise,
  exercise,
  exerciseMeta,
  isDraggingAny,
  onRemove,
  onUpdateSets,
  onUpdateIntensity,
  onUpdateNotes,
  collapsed = false,
  onExpand,
  dragging = false,
}: Props) => {
  const { normalizedETL } = getExerciseETL(
    exercise,
    exerciseMeta,
    "hypertrophy"
  );
  const durationMin = Math.ceil(estimateExerciseDuration(exercise) / 60);

  const showCollapsed = collapsed || isDraggingAny;

  const renderCollapsed = () => (
    <motion.div key="collapsed" layout {...animationProps}>
      <CollapsedExerciseCard
        order={order}
        exercise={exercise}
        normalizedETL={normalizedETL}
        durationMin={durationMin}
        onExpand={onExpand}
      />
    </motion.div>
  );

  const renderExpanded = () => (
    <motion.div key="expanded" layout {...animationProps}>
      <ExpandedExerciseCard
        order={order}
        onlyExercise={onlyExercise}
        exercise={exercise}
        trackingTypes={exerciseMeta?.tracking_type ?? ["reps"]}
        isDraggingAny={isDraggingAny}
        onRemove={onRemove}
        onUpdateSets={onUpdateSets}
        onUpdateIntensity={onUpdateIntensity}
        onUpdateNotes={onUpdateNotes}
        normalizedETL={normalizedETL}
      />
    </motion.div>
  );

  return (
    <motion.div layout>
      <AnimatePresence mode="sync" initial={false}>
        {showCollapsed ? renderCollapsed() : renderExpanded()}
      </AnimatePresence>
    </motion.div>
  );
};
