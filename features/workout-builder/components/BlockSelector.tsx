"use client";

import { SortableItem } from "@/components/SortableItem";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProgramBlock } from "@/types/Workout";
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
import { GripVertical, MoreVertical, Plus, Trash } from "lucide-react";
import { useState } from "react";

type Props = {
  blocks: ProgramBlock[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAddBlock: () => void;
  onRemoveBlock: (index: number) => void;
  onReorder: (reordered: ProgramBlock[]) => void;
  onRenameBlock: (index: number, newName: string) => void;
};

export function BlockSelector({
  blocks,
  activeIndex,
  onSelect,
  onAddBlock,
  onRemoveBlock,
  onReorder,
  onRenameBlock,
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
              <div className="flex items-center gap-3 w-full">
                <Button
                  onClick={() => onSelect(i)}
                  variant={i === activeIndex ? "default" : "outline"}
                  className="flex-1 justify-start truncate"
                >
                  {block.name || `Block ${i + 1}`}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => {
                        const newName = prompt(
                          "Rename block",
                          block.name || `Block ${i + 1}`
                        );
                        if (newName) onRenameBlock(i, newName);
                      }}
                    >
                      ✏️ Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onRemoveBlock(i)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="w-4 h-4 mr-2" /> Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
