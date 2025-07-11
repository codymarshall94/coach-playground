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
  onUpdateNotes: (
    groupIndex: number,
    exerciseIndex: number,
    notes: string
  ) => void;
  onUpdateGroupType: (
    groupIndex: number,
    type: WorkoutExerciseGroup["type"]
  ) => void;
  onAddExerciseToGroup: (groupIndex: number, exercise: Exercise) => void;
  onMoveExerciseByIdToGroup: (exerciseId: string, toGroupIndex: number) => void;
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
        "border rounded-lg p-4 space-y-4 bg-background shadow-sm transition",
        {
          "border-blue-500": group.type === "superset",
          "border-green-500": group.type === "circuit",
          "border-yellow-500": group.type === "giant_set",
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
                onSelect={(exercise) =>
                  onMoveExerciseByIdToGroup(exercise.id, groupIndex)
                }
                onAddExerciseToGroup={onAddExerciseToGroup}
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
        {group.exercises.map((exercise, exerciseIndex) => (
          <ExerciseBuilderCard
            key={exercise.id}
            order={groupOrder}
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
            onUpdateNotes={(notes) =>
              onUpdateNotes(groupIndex, exerciseIndex, notes)
            }
          />
        ))}
      </div>
    </motion.div>
  );
}
