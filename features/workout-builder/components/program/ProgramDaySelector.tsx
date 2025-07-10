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
    day.workout?.[0]?.exercise_groups?.reduce(
      (acc, group) =>
        acc + group.exercises.reduce((acc2, ex) => acc2 + ex.sets.length, 0),
      0
    ) ?? 0;

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Day Button */}
      <Button
        onClick={onClick}
        variant={isActive ? "default" : "outline"}
        className={`
          flex-1 justify-start truncate transition-all duration-200
          ${day.type === "rest" ? "text-muted-foreground italic" : ""}
          ${isDragOverlay ? "shadow-lg" : ""}
        `}
      >
        <span className="truncate">{day.name}</span>
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
      </Button>

      {/* Actions */}
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
      order: i,
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
                i === activeIndex && "shadow-lg ring-2 ring-primary/30"
              )}
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

          {/* Add buttons */}
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

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDay && (
          <div className="bg-background border rounded-lg shadow-xl ring-2 ring-blue-300 p-3 opacity-95">
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-blue-500" />
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
        )}
      </DragOverlay>
    </DndContext>
  );
}
