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
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Edit, GripVertical, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { ProgramDaySelector } from "./ProgramDaySelector";

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
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
  };

  const activeBlock = blocks.find((b) => b.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {blocks.map((block, i) => (
            <SortableItem key={block.id} id={block.id}>
              <div
                className="border rounded-lg p-4 space-y-4 shadow-sm bg-white"
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

      <DragOverlay>
        {activeBlock && (
          <div className="bg-white border rounded-lg shadow-xl ring-2 ring-blue-300 p-3 opacity-95">
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-blue-500" />
              <span>{activeBlock.name || "Training Block"}</span>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
