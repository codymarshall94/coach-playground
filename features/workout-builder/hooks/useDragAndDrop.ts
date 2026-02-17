"use client";

import type {
  DragEndEvent,
  DragStartEvent,
  Modifier,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useMemo, useState } from "react";

export type Id = UniqueIdentifier;

export interface UseDragAndDropOptions<TItem extends { id: Id }> {
  items: TItem[];
  onReorder: (next: TItem[]) => void;
  indexOfId?: (id: Id) => number;
  modifiers?: Modifier[];
}

export function useDragAndDrop<TItem extends { id: Id }>({
  items,
  onReorder,
  indexOfId,
  modifiers = [],
}: UseDragAndDropOptions<TItem>) {
  const [draggingId, setDraggingId] = useState<Id | null>(null);

  const idToIndex = useMemo(() => {
    if (indexOfId) return indexOfId;
    const map = new Map<Id, number>();
    items.forEach((it, i) => map.set(it.id, i));
    return (id: Id) => map.get(id) ?? -1;
  }, [items, indexOfId]);

  const handleDragStart = useCallback((e: DragStartEvent) => {
    setDraggingId(e.active.id);
  }, []);

  const handleDragCancel = useCallback(() => {
    setDraggingId(null);
  }, []);

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;
      setDraggingId(null);
      if (!over || active.id === over.id) return;

      const from = idToIndex(active.id);
      const to = idToIndex(over.id);
      if (from === -1 || to === -1 || from === to) return;

      const reordered = arrayMove(items, from, to);
      onReorder(reordered);
    },
    [idToIndex, items, onReorder]
  );

  return {
    draggingId,
    handlers: {
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onDragCancel: handleDragCancel,
    },
    modifiers,
  };
}
