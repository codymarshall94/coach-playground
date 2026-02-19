"use client";

import { SortableItem } from "@/components/SortableItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { ProgramBlock } from "@/types/Workout";
import { getBlockWeekCount, getBlockWeekDays } from "@/utils/program/weekHelpers";
import { ProgramDaySelector } from "./ProgramDaySelector";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { VERTICAL_LIST_MODIFIERS } from "@/features/workout-builder/dnd/constants";
import { DragOverlayPortal } from "@/features/workout-builder/dnd/overlay";
import { useSortableSensors } from "@/features/workout-builder/dnd/sensors";
import { useDragAndDrop } from "@/features/workout-builder/hooks/useDragAndDrop";

import {
  BarChart3,
  Copy,
  Edit,
  GripVertical,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import BlockOverviewPanel from "./BlockOverviewPanel";

/* ────────────────────────────────────────────────────────── */

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
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [overviewBlockIndex, setOverviewBlockIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (editingBlockIndex === null) return;
    const blk = blocks[editingBlockIndex];
    if (!blk) return;
    setEditName(blk.name ?? "");
    setEditDescription(blk.description ?? "");
  }, [editingBlockIndex, blocks]);

  const activeBlock =
    activeIndex !== null ? blocks[activeIndex] : null;
  const weekCount = activeBlock ? getBlockWeekCount(activeBlock) : 0;
  const currentWeekDays = activeBlock
    ? getBlockWeekDays(activeBlock, activeWeekIndex)
    : [];

  return (
    <div className="flex flex-col gap-0">
      {/* ═══════ ZONE 1 — Block strip ═══════ */}
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
          <div className="flex flex-col gap-1">
            {blocks.map((block, i) => {
              const isActive = i === activeIndex;
              const wc = getBlockWeekCount(block);
              return (
                <SortableItem
                  key={block.id}
                  id={block.id}
                  className={cn(isDragging && "opacity-50")}
                >
                  <div className="flex items-center gap-0.5">
                    <Button
                      size="sm"
                      variant={isActive ? "default" : "outline"}
                      className={cn(
                        "text-xs h-8 px-3 rounded-lg gap-1.5 flex-1 justify-start",
                        !isActive && "bg-card hover:bg-accent"
                      )}
                      onClick={() => onSelect(i)}
                    >
                      <span className="truncate max-w-[100px]">
                        {block.name || `Block ${i + 1}`}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] px-1 py-0 h-4 rounded-sm",
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {wc}w
                      </Badge>
                    </Button>

                    {/* block context menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-6 w-6 p-0 rounded-md",
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44">
                        <DropdownMenuItem
                          onClick={() => {
                            setOverviewBlockIndex(i);
                            setOverviewOpen(true);
                          }}
                          className="cursor-pointer"
                        >
                          <BarChart3 className="w-3.5 h-3.5 mr-2" />
                          Block Overview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingBlockIndex(i);
                            setSheetOpen(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 mr-2" />
                          Edit Block
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDuplicateBlock(i)}
                          className="cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {blocks.length > 1 && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onRemoveBlock(i)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash className="w-3.5 h-3.5 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SortableItem>
              );
            })}

            <Button
              onClick={onAddBlock}
              variant="ghost"
              size="sm"
              className="h-8 w-full border border-dashed text-xs text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Block
            </Button>
          </div>
        </SortableContext>

        <DragOverlayPortal
          draggingId={draggingId}
          render={(id) => {
            const block = blocks.find((b) => b.id === id)!;
            return (
              <div className="flex items-center gap-2 bg-background border-2 border-primary/50 rounded-lg px-3 py-1.5 shadow-2xl">
                <GripVertical className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium">
                  {block.name || "Training Block"}
                </span>
              </div>
            );
          }}
          withHalo
        />
      </DndContext>

      {/* ═══════ ZONE 2 — Week strip ═══════ */}
      {activeBlock && (
        <>
          <div className="border-t border-border/40 my-2" />

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {Array.from({ length: weekCount }, (_, wi) => (
              <Button
                key={wi}
                size="sm"
                variant={wi === activeWeekIndex ? "default" : "ghost"}
                className={cn(
                  "text-xs h-7 px-2.5 rounded-md flex-shrink-0",
                  wi === activeWeekIndex
                    ? "bg-primary/90 text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onSelectWeek(wi)}
              >
                W{wi + 1}
              </Button>
            ))}

            {/* week actions */}
            {weekCount > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 flex-shrink-0"
                    title={`Actions for W${activeWeekIndex + 1}`}
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44">
                  <DropdownMenuItem
                    onClick={() => onDuplicateWeek(activeWeekIndex)}
                    className="cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 mr-2" />
                    Duplicate W{activeWeekIndex + 1}
                  </DropdownMenuItem>
                  {weekCount > 1 && (
                    <DropdownMenuItem
                      onClick={() => onRemoveWeek(activeWeekIndex)}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash className="w-3.5 h-3.5 mr-2" />
                      Delete W{activeWeekIndex + 1}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 flex-shrink-0 text-muted-foreground hover:text-foreground"
              onClick={onAddWeek}
              title="Add week"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </>
      )}

      {/* ═══════ ZONE 3 — Day list ═══════ */}
      {activeBlock && (
        <>
          <div className="border-t border-border/40 my-2" />

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

      {/* ═══════ Sheets ═══════ */}

      {/* Block settings sheet */}
      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditingBlockIndex(null);
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Block Settings</SheetTitle>
            <SheetDescription>
              Update name and description for this block.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4 pb-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Block name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                placeholder="Block goals and notes..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (editingBlockIndex !== null)
                    onDuplicateBlock(editingBlockIndex);
                }}
              >
                <Copy className="w-4 h-4 mr-1" />
                Duplicate
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (editingBlockIndex !== null)
                    onRemoveBlock(editingBlockIndex);
                  setSheetOpen(false);
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash className="w-4 h-4 mr-1" />
                Delete
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  if (editingBlockIndex !== null) {
                    onUpdateBlockDetails(editingBlockIndex, {
                      name: editName,
                      description: editDescription,
                    });
                  }
                  setSheetOpen(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Block overview sheet */}
      <Sheet
        open={overviewOpen}
        onOpenChange={(open) => {
          setOverviewOpen(open);
          if (!open) setOverviewBlockIndex(null);
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto"
        >
          {overviewBlockIndex !== null && (
            <BlockOverviewPanel
              block={blocks[overviewBlockIndex]}
              onClose={() => setOverviewOpen(false)}
              onOpenWeek={(wi) => {
                onSelect(overviewBlockIndex);
                onSelectWeek(wi);
                setOverviewOpen(false);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
