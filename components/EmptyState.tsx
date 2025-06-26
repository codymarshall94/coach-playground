import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed border-gray-200 rounded-md bg-gray-50",
        className
      )}
    >
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  );
};
