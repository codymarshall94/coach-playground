"use client";

import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

export function SortableItem({
  children,
  id,
  isDragging = false,
  onClick,
  className,
  draggerClassName,
}: {
  id: string;
  children: React.ReactNode;
  isDragging?: boolean;
  onClick?: () => void;
  className?: string;
  draggerClassName?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Or a non-drag placeholder (e.g. a placeholder div)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        `
        flex items-center gap-3 px-3 py-2 bg-background border rounded-lg 
        transition-all duration-200 ease-in-out
        ${
          isSortableDragging &&
          "opacity-50 scale-105 shadow-lg ring-2 ring-primary/50 z-50"
        }
        ${isDragging && "shadow-xl ring-2 ring-primary/50"}
      `,
        className
      )}
      onClick={onClick}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn(
          `
          cursor-grab active:cursor-grabbing p-1 rounded
          transition-colors duration-200
          ${
            isSortableDragging
              ? "text-blue-500 bg-blue-50"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }
        `
        )}
      >
        <GripVertical
          className={cn("w-4 h-4 text-muted-foreground", draggerClassName)}
        />
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
