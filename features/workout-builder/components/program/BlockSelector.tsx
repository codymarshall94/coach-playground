"use client";

import { SortableItem } from "@/components/SortableItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import type { ProgramBlock, ProgramDay } from "@/types/Workout";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
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
import { Edit, GripVertical, Plus, Trash } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ProgramDaySelector } from "./ProgramDaySelector";
import { cn } from "@/lib/utils";

type Props = {
  blocks: ProgramBlock[];
  activeIndex: number;
  activeDayIndex: number;
  onSelect: (index: number) => void;
  onAddBlock: () => void;
  onRemoveBlock: (index: number) => void;
  onReorder: (reordered: ProgramBlock[]) => void;
  onSelectDay: (index: number) => void;
  onAddWorkoutDay: () => void;
  onAddRestDay: () => void;
  onRemoveWorkoutDay: (index: number) => void;
  onDuplicateWorkoutDay: (index: number) => void;
  onReorderDays: (reordered: ProgramDay[]) => void;
  onUpdateBlockDetails: (index: number, updates: Partial<ProgramBlock>) => void;
};

export function BlockSelector({
  blocks,
  activeIndex,
  activeDayIndex,
  onSelect,
  onAddBlock,
  onRemoveBlock,
  onReorder,
  onSelectDay,
  onAddWorkoutDay,
  onAddRestDay,
  onRemoveWorkoutDay,
  onDuplicateWorkoutDay,
  onReorderDays,
  onUpdateBlockDetails,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);

    const reordered = arrayMove(blocks, oldIndex, newIndex).map((b, i) => ({
      ...b,
      order: i,
    }));

    onReorder(reordered);
    setIsDragging(false);
  };

  const activeBlock = blocks.find((b) => b.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {blocks.map((block, i) => (
            <SortableItem
              key={block.id}
              id={block.id}
              className={cn(isDragging && "opacity-50")}
            >
              <div
                className="border rounded-lg p-4 space-y-4 shadow-sm bg-card"
                onClick={() => onSelect(i)}
              >
                <div className="flex justify-between items-center">
                  <Button variant={i === activeIndex ? "default" : "outline"}>
                    {block.name || `Block ${i + 1}`}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                    >
                      {block.weeks || 4} Weeks
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                    >
                      {block.days.length}{" "}
                      {block.days.length === 1 ? "Day" : "Days"}
                    </Badge>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="end">
                        <div className="space-y-4">
                          <h4 className="font-medium">Edit Block</h4>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Name</Label>
                            <Input
                              value={block.name || ""}
                              onChange={(e) =>
                                onUpdateBlockDetails(i, {
                                  name: e.target.value,
                                })
                              }
                              placeholder="Block name"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Weeks
                              </Label>
                              <Input
                                type="number"
                                min="1"
                                max="52"
                                value={block.weeks || ""}
                                onChange={(e) =>
                                  onUpdateBlockDetails(i, {
                                    weeks: Number(e.target.value) || undefined,
                                  })
                                }
                                placeholder="4"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Description
                            </Label>
                            <Textarea
                              value={block.description || ""}
                              onChange={(e) =>
                                onUpdateBlockDetails(i, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="Block goals and notes..."
                              rows={2}
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-2 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRemoveBlock(i)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {i === activeIndex && (
                  <ProgramDaySelector
                    days={block.days}
                    activeIndex={activeDayIndex}
                    onSelect={onSelectDay}
                    onAddWorkoutDay={onAddWorkoutDay}
                    onAddRestDay={onAddRestDay}
                    onRemoveWorkoutDay={onRemoveWorkoutDay}
                    onDuplicateWorkoutDay={onDuplicateWorkoutDay}
                    onReorder={onReorderDays}
                  />
                )}
              </div>
            </SortableItem>
          ))}

          <Button
            onClick={onAddBlock}
            variant="secondary"
            className="w-full mt-4 border border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Block
          </Button>
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
        {activeBlock && (
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
                  <span>{activeBlock.name || "Training Block"}</span>
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
