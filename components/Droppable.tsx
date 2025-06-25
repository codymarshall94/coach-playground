import { useDroppable } from "@dnd-kit/core";

export function Droppable({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
          min-h-[400px] border-2 border-dashed rounded-xl p-6 transition-all duration-200
          ${
            isOver
              ? "border-blue-400 bg-blue-50/50"
              : "border-gray-300 bg-gray-50/50"
          }
        `}
    >
      {children}
    </div>
  );
}
