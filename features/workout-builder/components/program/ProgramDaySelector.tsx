"use client";

import { SortableItem } from "@/components/SortableItem";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VERTICAL_LIST_MODIFIERS } from "@/features/workout-builder/dnd/constants";
import { DragOverlayPortal } from "@/features/workout-builder/dnd/overlay";
import { useSortableSensors } from "@/features/workout-builder/dnd/sensors";
import { useDragAndDrop } from "@/features/workout-builder/hooks/useDragAndDrop";
import { cn } from "@/lib/utils";
import type { ProgramDay } from "@/types/Workout";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Bed, Dumbbell, MoreVertical, Plus, Trash } from "lucide-react";

type Props = {
  days: ProgramDay[];
  activeIndex: number | null;
  onSelect: (index: number) => void;
  onRemoveWorkoutDay: (index: number) => void;
  onDuplicateWorkoutDay: (index: number) => void;
  onAddWorkoutDay: () => void;
  onAddRestDay: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
};

function DayButton({
  day,
  index,
  isActive,
  onRemove,
  onDuplicate,
  isDragOverlay = false,
}: {
  day: ProgramDay;
  index: number;
  isActive: boolean;
  onRemove: () => void;
  onDuplicate: () => void;
  isDragOverlay?: boolean;
}) {
  const totalExercises =
    day.groups?.flatMap((g: any) => g.exercises).length ?? 0;

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-xs",
            isActive && "text-primary-foreground font-semibold"
          )}
        >
          {(day.order_num ?? index) + 1}.
        </span>
        <span
          className={cn(
            "text-sm font-medium",
            isActive && "text-primary-foreground font-semibold"
          )}
        >
          {day.name}
        </span>
        {day.type === "rest" ? (
          <Bed
            className={cn(
              "w-3.5 h-3.5 flex-shrink-0 text-muted-foreground",
              isActive && "text-primary-foreground"
            )}
          />
        ) : (
          <Dumbbell
            className={cn(
              "w-3.5 h-3.5 flex-shrink-0 text-muted-foreground",
              isActive && "text-primary-foreground"
            )}
          />
        )}
      </div>

      {day.type === "workout" && totalExercises > 0 && (
        <div
          className={cn(
            "ml-auto rounded-full min-w-[20px] h-5 px-1.5 grid place-items-center text-[11px] font-medium bg-foreground/5 text-foreground/80 shadow-sm",
            isActive && "bg-primary/10 text-primary-foreground"
          )}
        >
          {totalExercises}
        </div>
      )}

      {!isDragOverlay && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical
                className={cn(
                  "w-4 h-4 text-muted-foreground",
                  isActive && "text-primary-foreground"
                )}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={onDuplicate} className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onRemove}
              className="cursor-pointer text-destructive focus:text-destructive"
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
  onMove,
}: Props) {
  const sensors = useSortableSensors();

  const { draggingId, handlers, modifiers } = useDragAndDrop({
    items: days,
    onReorder: (next) => {
      if (!draggingId) return;
      const from = days.findIndex((d) => d.id === draggingId);
      const to = next.findIndex((d) => d.id === draggingId);
      if (from !== -1 && to !== -1 && from !== to) onMove(from, to);
    },
    modifiers: VERTICAL_LIST_MODIFIERS,
  });

  const activeDraggedIndex = draggingId
    ? days.findIndex((d) => d.id === draggingId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      {...handlers}
      modifiers={modifiers}
    >
      <SortableContext
        items={days.map((d) => d.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-1.5">
          {days.map((day, i) => (
            <SortableItem
              key={day.id}
              id={day.id}
              className={cn(
                "px-2.5 py-1.5 rounded-lg min-h-[36px] cursor-pointer transition-colors ",
                i === activeIndex
                  ? "bg-primary text-primary-foreground ring-1 ring-inset ring-primary/20"
                  : "hover:bg-foreground/5 "
              )}
              draggerClassName={cn(
                i === activeIndex && "text-primary-foreground/80"
              )}
              onClick={() => onSelect(i)}
            >
              <DayButton
                day={day}
                index={i}
                isActive={i === activeIndex}
                onRemove={() => onRemoveWorkoutDay(i)}
                onDuplicate={() => onDuplicateWorkoutDay(i)}
              />
            </SortableItem>
          ))}

          <div className="flex gap-1.5 mt-1">
            <Button
              onClick={onAddWorkoutDay}
              variant="outline"
              size="sm"
              className="flex-1 cursor-pointer text-xs h-8"
            >
              <Dumbbell className="w-3.5 h-3.5 mr-1.5" />
              Add Workout
            </Button>
            <Button
              onClick={onAddRestDay}
              variant="ghost"
              size="sm"
              className="flex-1 cursor-pointer text-xs h-8"
            >
              <Bed className="w-3.5 h-3.5 mr-1.5" />
              Add Rest
            </Button>
          </div>
        </div>
      </SortableContext>

      <DragOverlayPortal
        draggingId={draggingId}
        render={(id) => {
          const day = days.find((d) => d.id === id)!;
          return (
            <div className="px-2.5 py-1.5 rounded-lg min-h-[36px] bg-background ring-2 ring-primary/30 shadow-lg">
              <DayButton
                day={day}
                index={activeDraggedIndex ?? 0}
                isActive
                onRemove={() => {}}
                onDuplicate={() => {}}
                isDragOverlay
              />
            </div>
          );
        }}
        withHalo
      />
    </DndContext>
  );
}
