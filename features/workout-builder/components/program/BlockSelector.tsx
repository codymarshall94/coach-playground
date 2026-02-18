"use client";

import { SortableItem } from "@/components/SortableItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// popover replaced with Sheet for block settings
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { ProgramBlock } from "@/types/Workout";
import { getBlockWeekCount, getBlockWeekDays } from "@/utils/program/weekHelpers";
import { ProgramDaySelector } from "./ProgramDaySelector";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Textarea } from "@/components/ui/textarea";
import { VERTICAL_LIST_MODIFIERS } from "@/features/workout-builder/dnd/constants";
import { DragOverlayPortal } from "@/features/workout-builder/dnd/overlay";
import { useSortableSensors } from "@/features/workout-builder/dnd/sensors";
import { useDragAndDrop } from "@/features/workout-builder/hooks/useDragAndDrop";

import { Calendar, Copy, Edit, GripVertical, Plus, Trash, MoreHorizontal } from "lucide-react";

type Props = {
  blocks: ProgramBlock[];
  activeIndex: number | null;
  activeDayIndex: number | null;
  activeWeekIndex: number;
  onSelect: (index: number) => void;
  onAddBlock: () => void;
  onRemoveBlock: (index: number) => void;
  onDuplicateBlock: (index: number) => void;
  onReorder: (reordered: ProgramBlock[]) => void;
  onSelectDay: (index: number) => void;
  onSelectWeek: (weekIndex: number) => void;
  onAddWeek: () => void;
  onRemoveWeek: (weekIndex: number) => void;
  onDuplicateWeek: (weekIndex: number) => void;
  onAddWorkoutDay: () => void;
  onAddRestDay: () => void;
  onRemoveWorkoutDay: (index: number) => void;
  onDuplicateWorkoutDay: (index: number) => void;
  onMoveDay: (fromIndex: number, toIndex: number) => void;
  onUpdateBlockDetails: (index: number, updates: Partial<ProgramBlock>) => void;
};

export function BlockSelector({
  blocks,
  activeIndex,
  activeDayIndex,
  activeWeekIndex,
  onSelect,
  onAddBlock,
  onRemoveBlock,
  onDuplicateBlock,
  onReorder,
  onSelectDay,
  onSelectWeek,
  onAddWeek,
  onRemoveWeek,
  onDuplicateWeek,
  onAddWorkoutDay,
  onAddRestDay,
  onRemoveWorkoutDay,
  onDuplicateWorkoutDay,
  onMoveDay,
  onUpdateBlockDetails,
}: Props) {
  const sensors = useSortableSensors();

  const { draggingId, handlers, modifiers } = useDragAndDrop({
    items: blocks,
    onReorder: (next) => onReorder(next.map((b, i) => ({ ...b, order: i }))),
    modifiers: VERTICAL_LIST_MODIFIERS,
  });

  const isDragging = !!draggingId;

  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (editingBlockIndex === null) return;
    const blk = blocks[editingBlockIndex];
    if (!blk) return;
    setEditName(blk.name ?? "");
    setEditDescription(blk.description ?? "");
  }, [editingBlockIndex, blocks]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      {...handlers}
      modifiers={modifiers}
    >
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {blocks.map((block, i) => {
            const weekCount = getBlockWeekCount(block);
            const currentWeekDays = getBlockWeekDays(block, i === activeIndex ? activeWeekIndex : 0);

            return (
              <SortableItem
                key={block.id}
                id={block.id}
                className={cn(isDragging && "opacity-50")}
              >
                <div
                  className="border rounded-lg p-2.5 space-y-2.5 shadow-sm bg-card"
                  onClick={() => onSelect(i)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Button size="sm" variant={i === activeIndex ? "default" : "outline"} className="text-xs h-7 truncate">
                      {block.name || `Block ${i + 1}`}
                    </Button>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-blue-200 text-[11px] px-1.5 py-0 whitespace-nowrap dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                      >
                        {weekCount}w
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-blue-200 text-[11px] px-1.5 py-0 whitespace-nowrap dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                      >
                        {currentWeekDays.length}d
                      </Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBlockIndex(i);
                          setSheetOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Week tabs — shown when this block is active */}
                  {i === activeIndex && (
                    <>
                      <div className="flex items-center gap-1 flex-wrap">
                        {Array.from({ length: weekCount }, (_, wi) => (
                          <Button
                            key={wi}
                            size="sm"
                            variant={wi === activeWeekIndex ? "default" : "ghost"}
                            className={cn(
                              "text-[11px] h-6 px-2 rounded-md",
                              wi === activeWeekIndex
                                ? "bg-primary/90 text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectWeek(wi);
                            }}
                          >
                            W{wi + 1}
                          </Button>
                        ))}

                        {/* single menu for actions on the active week */}
                        {weekCount > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => e.stopPropagation()}
                                title={activeWeekIndex !== undefined ? `Actions for W${activeWeekIndex + 1}` : "Week actions"}
                              >
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-40">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (activeWeekIndex !== undefined) onDuplicateWeek(activeWeekIndex);
                                }}
                                className="cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5 mr-2" />
                                {activeWeekIndex !== undefined ? `Duplicate Week W${activeWeekIndex + 1}` : `Duplicate Week`}
                              </DropdownMenuItem>
                              {weekCount > 1 && activeWeekIndex !== undefined && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveWeek(activeWeekIndex);
                                  }}
                                  className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                  <Trash className="w-3.5 h-3.5 mr-2" />
                                    {`Delete Week W${activeWeekIndex + 1}`}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[11px] h-6 px-1.5 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddWeek();
                          }}
                          title="Add empty week"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <ProgramDaySelector
                        days={currentWeekDays}
                        activeIndex={activeDayIndex}
                        onSelect={onSelectDay}
                        onAddWorkoutDay={onAddWorkoutDay}
                        onAddRestDay={onAddRestDay}
                        onRemoveWorkoutDay={onRemoveWorkoutDay}
                        onDuplicateWorkoutDay={onDuplicateWorkoutDay}
                        onMove={onMoveDay}
                      />
                    </>
                  )}
                </div>
              </SortableItem>
            );
          })}

          <Button
            onClick={onAddBlock}
            variant="secondary"
            size="sm"
            className="w-full mt-2 border border-dashed text-xs h-8"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Block
          </Button>
        </div>
      </SortableContext>

      <DragOverlayPortal
        draggingId={draggingId}
        render={(id) => {
          const block = blocks.find((b) => b.id === id)!;
          const wkCount = getBlockWeekCount(block);
          return (
            <div className="relative bg-background border-2 border-primary/50 rounded-lg p-3 shadow-2xl">
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-primary" />
                <span>{block.name || "Training Block"}</span>
                <div className="ml-auto flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                  >
                    {wkCount} {wkCount === 1 ? "Week" : "Weeks"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                  >
                    {block.days.length}{" "}
                    {block.days.length === 1 ? "Day" : "Days"}
                  </Badge>
                </div>
              </div>
            </div>
          );
        }}
        withHalo
      />

      {/* Block settings sheet */}
      <Sheet open={sheetOpen} onOpenChange={(open) => {
        setSheetOpen(open);
        if (!open) setEditingBlockIndex(null);
      }}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Block Settings</SheetTitle>
            <SheetDescription>Update name and description for this block.</SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4 pb-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Block name" />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={4} placeholder="Block goals and notes..." />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => {
                if (editingBlockIndex !== null) onDuplicateBlock(editingBlockIndex);
              }}>
                <Copy className="w-4 h-4 mr-1" />
                Duplicate
              </Button>

              <Button variant="outline" size="sm" onClick={() => {
                if (editingBlockIndex !== null) onRemoveBlock(editingBlockIndex);
                setSheetOpen(false);
              }} className="text-red-600 hover:text-red-700">
                <Trash className="w-4 h-4 mr-1" />
                Delete
              </Button>

              <Button size="sm" onClick={() => {
                if (editingBlockIndex !== null) {
                  onUpdateBlockDetails(editingBlockIndex, { name: editName, description: editDescription });
                }
                setSheetOpen(false);
              }}>
                Save
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </DndContext>
  );
}
