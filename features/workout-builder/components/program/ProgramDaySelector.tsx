"use client";

import { SortableItem } from "@/components/SortableItem";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ProgramDay } from "@/types/Workout";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Bed,
  Dumbbell,
  GripVertical,
  MoreVertical,
  Plus,
  Trash,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type Props = {
  days: ProgramDay[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onRemoveWorkoutDay: (index: number) => void;
  onDuplicateWorkoutDay: (index: number) => void;
  onAddWorkoutDay: () => void;
  onAddRestDay: () => void;
  onReorder: (updated: ProgramDay[]) => void;
};

function DayButton({
  day,
  index,
  isActive,
  onClick,
  onRemove,
  onDuplicate,
  isDragOverlay = false,
}: {
  day: ProgramDay;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  isDragOverlay?: boolean;
}) {
  const totalExercises =
    day.workout?.[0]?.exercise_groups?.flatMap((g) => g.exercises).length ?? 0;

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="truncate font-medium">{day.order_num + 1}.</span>
      <span className="truncate font-medium">{day.name}</span>
      {day.type === "rest" && <Bed className="w-4 h-4 ml-2 flex-shrink-0" />}
      {day.type === "workout" && (
        <Dumbbell className="w-4 h-4 ml-2 flex-shrink-0" />
      )}
      {day.type === "workout" && totalExercises > 0 && (
        <div
          className={cn(
            "flex items-center justify-center ml-auto bg-secondary  text-secondary-foreground rounded-full min-w-[24px] h-6 px-2 text-xs font-medium shadow-sm",
            isActive && "bg-background text-foreground"
          )}
        >
          {totalExercises}
        </div>
      )}

      {!isDragOverlay && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors text-muted-foreground"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onDuplicate} className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onRemove}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash className="w-4 h-4 mr-2" /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export function ProgramDaySelector({
  days,
  activeIndex,
  onSelect,
  onRemoveWorkoutDay,
  onDuplicateWorkoutDay,
  onAddWorkoutDay,
  onAddRestDay,
  onReorder,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = days.findIndex((d) => d.id === active.id);
    const newIndex = days.findIndex((d) => d.id === over.id);

    const reordered = arrayMove(days, oldIndex, newIndex).map((d, i) => ({
      ...d,
      order_num: i,
    }));

    onReorder(reordered);
  };

  const activeDayIndex = activeId
    ? days.findIndex((d) => d.id === activeId)
    : -1;
  const activeDay = activeDayIndex >= 0 ? days[activeDayIndex] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext
        items={days.map((d) => d.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {days.map((day, i) => (
            <SortableItem
              key={day.id}
              id={day.id}
              className={cn(
                "cursor-pointer",
                i !== activeIndex && "hover:bg-primary/10",
                i === activeIndex &&
                  "shadow-lg bg-primary text-primary-foreground border-primary/50"
              )}
              draggerClassName={cn(i === activeIndex && "text-white")}
              onClick={() => onSelect(i)}
            >
              <DayButton
                day={day}
                index={i}
                isActive={i === activeIndex}
                onClick={() => onSelect(i)}
                onRemove={() => onRemoveWorkoutDay(i)}
                onDuplicate={() => onDuplicateWorkoutDay(i)}
              />
            </SortableItem>
          ))}

          <div className="flex gap-2 mt-4 pt-2 border-t border-border">
            <Button
              onClick={onAddWorkoutDay}
              variant="outline"
              className="flex-1 cursor-pointer"
            >
              <Dumbbell className="w-4 h-4 mr-2" />
              Add Workout Day
            </Button>
            <Button
              onClick={onAddRestDay}
              variant="ghost"
              className="flex-1 cursor-pointer"
            >
              <Bed className="w-4 h-4 mr-2" />
              Add Rest Day
            </Button>
          </div>
        </div>
      </SortableContext>

      <DragOverlay
        dropAnimation={{
          duration: 300,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
        style={{
          transformOrigin: "0 0",
        }}
      >
        {activeDay && (
          <motion.div
            initial={{
              scale: 1,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              scale: 1.03,
              opacity: 0.95,
            }}
            exit={{
              scale: 0.98,
              rotate: 0,
              opacity: 0.8,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="z-[999] pointer-events-none"
            style={{
              filter: "drop-shadow(0 20px 25px rgb(0 0 0 / 0.15))",
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm" />

              <div className="relative bg-background border-2 border-primary/50 rounded-lg p-3 shadow-2xl">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-primary" />

                  <DayButton
                    day={activeDay}
                    index={activeDayIndex}
                    isActive={activeDayIndex === activeIndex}
                    onClick={() => {}}
                    onRemove={() => {}}
                    onDuplicate={() => {}}
                    isDragOverlay={true}
                  />
                </div>
              </div>

              <motion.div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
