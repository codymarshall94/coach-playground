import type React from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";

export function SortableItem({
  children,
  id,
  isDragging = false,
}: {
  id: string;
  children: React.ReactNode;
  isDragging?: boolean;
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-3 px-3 py-2 bg-white border rounded-lg 
        transition-all duration-200 ease-in-out
        ${
          isSortableDragging
            ? "opacity-50 scale-105 shadow-lg ring-2 ring-blue-200 z-50"
            : "hover:bg-gray-50 hover:shadow-md"
        }
        ${isDragging ? "shadow-xl ring-2 ring-blue-300" : ""}
      `}
    >
      {/* Enhanced Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={`
          cursor-grab active:cursor-grabbing p-1 rounded
          transition-colors duration-200
          ${
            isSortableDragging
              ? "text-blue-500 bg-blue-50"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }
        `}
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
