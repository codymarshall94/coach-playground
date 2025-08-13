"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  image?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
  center?: boolean;
}

export const EmptyState = ({
  icon,
  image,
  title,
  description,
  action,
  className,
  compact = false,
  center = false,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center  rounded-md",
        compact ? "py-6 px-4 text-sm" : "py-12 px-6 text-base",
        center && "h-[60vh]",
        className
      )}
    >
      {image ? (
        image
      ) : (
        <div className="mb-4 text-muted-foreground">
          <div className="w-10 h-10">
            {icon ?? <Inbox className="w-full h-full opacity-50" />}
          </div>
        </div>
      )}

      <h3 className="font-semibold mb-1">{title}</h3>

      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          {description}
        </p>
      )}

      {action}
    </motion.div>
  );
};
