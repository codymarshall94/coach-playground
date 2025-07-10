import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Exercise } from "@/types/Exercise";
import { WorkoutExerciseGroup } from "@/types/Workout";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AddToGroupPopover } from "./AddToGroupPopover";
import { ExerciseBuilderCard } from "./ExerciseBuilderCard";

interface Props {
  exerciseGroups: WorkoutExerciseGroup[];
  group: WorkoutExerciseGroup;
  groupIndex: number;
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
  onUpdateGroupRest: (groupIndex: number, rest: number) => void;
  onAddExerciseToGroup: (groupIndex: number, exercise: Exercise) => void;
  targetGroupIndex: number | null;
  setTargetGroupIndex: (groupIndex: number) => void;
  onMoveExerciseToGroup: (
    fromGroupIndex: number,
    exerciseIndex: number,
    toGroupIndex: number
  ) => void;
  onMoveExerciseByIdToGroup: (exerciseId: string, toGroupIndex: number) => void;
}

const GROUP_CONFIG = {
  standard: {
    label: "Standard",
    color: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    borderColor: "border-gray-300",
    description: "Individual exercises performed with standard rest periods.",
    maxExercises: 1,
  },
  superset: {
    label: "Superset",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    borderColor: "border-blue-500",
    description: "Two exercises done back to back without rest.",
    maxExercises: 2,
  },
  giant_set: {
    label: "Giant Set",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    borderColor: "border-yellow-500",
    description:
      "3+ exercises for the same muscle group performed consecutively.",
    maxExercises: 3,
  },

  circuit: {
    label: "Circuit",
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    borderColor: "border-green-500",
    description: "A full-body rotation with minimal rest between exercises.",
    maxExercises: 6,
  },
};

export function ExerciseGroupCard({
  exerciseGroups,
  group,
  groupIndex,
  isDraggingAny,
  collapsedIndex,
  onExpand,
  onRemoveExercise,
  onUpdateSets,
  onUpdateIntensity,
  onUpdateNotes,
  onUpdateGroupType,
  onUpdateGroupRest,
  targetGroupIndex,
  setTargetGroupIndex,
  onMoveExerciseToGroup,
  onMoveExerciseByIdToGroup,
}: Props) {
  const isCollapsed = collapsedIndex !== null && collapsedIndex !== groupIndex;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<
    WorkoutExerciseGroup["type"]
  >(group.type);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const currentConfig = GROUP_CONFIG[selectedType];

  const handleTypeChange = (type: WorkoutExerciseGroup["type"]) => {
    setSelectedType(type);
    onUpdateGroupType(groupIndex, type);
    setIsPopoverOpen(false);
  };

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
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Badge
                  className={cn(
                    "cursor-pointer transition-all duration-200 border-0",
                    currentConfig.color
                  )}
                >
                  <motion.span
                    key={group.type}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentConfig.label}
                  </motion.span>
                </Badge>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="p-4"
              >
                <h3 className="font-semibold mb-3 text-sm">
                  Choose Group Type
                </h3>
                <div className="space-y-2">
                  <AnimatePresence mode="wait">
                    {Object.entries(GROUP_CONFIG).map(([type, config]) => (
                      <motion.div
                        key={type}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative"
                      >
                        <motion.button
                          onClick={() =>
                            handleTypeChange(
                              type as WorkoutExerciseGroup["type"]
                            )
                          }
                          className={cn(
                            "w-full text-left p-3 rounded-lg border-2 transition-all duration-200",
                            selectedType === type
                              ? `${config.borderColor.replace(
                                  "border-",
                                  "border-"
                                )} bg-opacity-20`
                              : "border-transparent hover:border-gray-200",
                            config.color.replace("hover:", "")
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">
                                {config.label}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {config.description}
                              </div>
                            </div>
                            <AnimatePresence>
                              {selectedType === type && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-2 h-2 bg-current rounded-full"
                                />
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </PopoverContent>
          </Popover>
        </div>
        {group.type !== "standard" &&
          group.exercises.length < currentConfig.maxExercises && (
            <AddToGroupPopover
              trigger={
                <Button variant="outline" size="sm">
                  + Add Exercise to Group
                </Button>
              }
              onSelect={(exercise) =>
                onMoveExerciseByIdToGroup(exercise.id, groupIndex)
              }
              groupIndex={groupIndex}
              existingExercises={exerciseGroups.flatMap((g) => g.exercises)}
              allExercises={[]}
            />
          )}
      </div>

      <div className="space-y-3">
        {group.exercises.map((exercise, exerciseIndex) => (
          <ExerciseBuilderCard
            key={exercise.id}
            order={exercise.order_num}
            exercise={exercise}
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
            showAddToGroup={
              targetGroupIndex !== null && targetGroupIndex !== groupIndex
            }
            onAddToGroupClick={() =>
              onMoveExerciseToGroup(
                groupIndex,
                exerciseIndex,
                targetGroupIndex!
              )
            }
          />
        ))}
      </div>
    </motion.div>
  );
}
