import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Exercise } from "@/types/Exercise";
import { WorkoutExerciseGroup } from "@/types/Workout";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { motion } from "motion/react";
import { AddToGroupPopover } from "./AddToGroupPopover";
import { ExerciseBuilderCard } from "./ExerciseBuilderCard";
import { GROUP_CONFIG, GroupTypeSelector } from "./GroupTypeSelector";

interface Props {
  exerciseGroups: WorkoutExerciseGroup[];
  allExercises: Exercise[];
  group: WorkoutExerciseGroup;
  groupIndex: number;
  exerciseMeta: Exercise;
  isDraggingAny: boolean;
  collapsedIndex: number | null;
  onExpand: () => void;
  onRemoveExercise: (groupIndex: number, exerciseIndex: number) => void;
  onUpdateSets: (
    groupIndex: number,
    exerciseIndex: number,
    sets: any[]
  ) => void;
  onUpdateIntensity: (
    groupIndex: number,
    exerciseIndex: number,
    intensity: any
  ) => void;
  onUpdateNotes: (groupIndex: number, notes: string) => void;
  onUpdateGroupType: (
    groupIndex: number,
    type: WorkoutExerciseGroup["type"]
  ) => void;
  onAddExerciseToGroup: (groupIndex: number, exercise: Exercise) => void;
  onMoveExerciseByIdToGroup: (exerciseId: string, toGroupIndex: number) => void;
  exerciseLibraryOpen: boolean;
  setExerciseLibraryOpen: (open: boolean) => void;
}

export function ExerciseGroupCard({
  exerciseGroups,
  allExercises,
  group,
  groupIndex,
  exerciseMeta,
  isDraggingAny,
  collapsedIndex,
  onExpand,
  onRemoveExercise,
  onUpdateSets,
  onUpdateIntensity,
  onUpdateNotes,
  onUpdateGroupType,
  onAddExerciseToGroup,
  onMoveExerciseByIdToGroup,
  exerciseLibraryOpen,
  setExerciseLibraryOpen,
}: Props) {
  const isCollapsed = collapsedIndex !== null && collapsedIndex !== groupIndex;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTypeChange = (type: WorkoutExerciseGroup["type"]) => {
    onUpdateGroupType(groupIndex, type);
  };

  const currentConfig = GROUP_CONFIG[group.type];

  const groupOrder = group.order_num;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border rounded-lg p-4  bg-card shadow-sm transition",
        {
          "border-indigo-700 bg-indigo-700/10": group.type === "superset",
          "border-emerald-500 bg-emerald-500/10": group.type === "circuit",
          "border-orange-500 bg-orange-500/10": group.type === "giant_set",
        }
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div {...listeners} {...attributes} className="cursor-grab">
            <GripVertical className="w-4 h-4" />
          </div>
          <GroupTypeSelector
            groupType={group.type}
            onGroupTypeChange={handleTypeChange}
          />
        </div>
        {group.type !== "standard" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {group.exercises.length} of {currentConfig.maxExercises} used
            </span>

            {group.exercises.length < currentConfig.maxExercises && (
              <AddToGroupPopover
                trigger={
                  <Button variant="outline" size="sm">
                    + Add Exercise
                  </Button>
                }
                onSelect={(exercise, cloneFrom) => {
                  if (cloneFrom) {
                    // Move the *existing instance* using its instance id
                    onMoveExerciseByIdToGroup(cloneFrom.id, groupIndex);
                  } else {
                    // Add a brand-new instance from library
                    onAddExerciseToGroup(groupIndex, exercise);
                  }
                }}
                onAddExerciseToGroup={onAddExerciseToGroup}
                exerciseLibraryOpen={exerciseLibraryOpen}
                setExerciseLibraryOpen={setExerciseLibraryOpen}
                groupIndex={groupIndex}
                existingExercises={exerciseGroups
                  .flatMap((g) => g.exercises)
                  .filter(
                    (ex) =>
                      !group.exercises.some(
                        (e) => e.exercise_id === ex.exercise_id
                      )
                  )}
                allExercises={allExercises || []}
              />
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {group.exercises.map((exercise, exerciseIndex) => {
          const onlyExercise = group.exercises.length === 1;
          return (
            <ExerciseBuilderCard
              key={exercise.id}
              order={groupOrder}
              onlyExercise={onlyExercise}
              exercise={exercise}
              exerciseMeta={exerciseMeta}
              isDraggingAny={isDraggingAny}
              collapsed={isCollapsed}
              onExpand={onExpand}
              onRemove={() => onRemoveExercise(groupIndex, exerciseIndex)}
              onUpdateSets={(sets) =>
                onUpdateSets(groupIndex, exerciseIndex, sets)
              }
              onUpdateIntensity={(intensity) =>
                onUpdateIntensity(groupIndex, exerciseIndex, intensity)
              }
              onUpdateNotes={(notes) => onUpdateNotes(groupIndex, notes)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
