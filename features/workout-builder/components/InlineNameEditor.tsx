"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit3, X } from "lucide-react";
import * as React from "react";

type Size = "sm" | "md" | "lg";

const variants = {
  enter: { opacity: 0, x: -4 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -4 },
};

const sizeText: Record<Size, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

const weightText = "font-bold";

const sizeInput: Record<Size, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

export interface InlineNameEditorProps {
  name: string;
  onSave: (next: string) => void;
  placeholder?: string;
  size?: Size;
  className?: string;
  textClassName?: string;
  inputClassName?: string;
  showEditButton?: boolean;
  saveOnBlur?: boolean;
  fallback?: string;
  isEditing?: boolean;
  onEditingChange?: (v: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
}

export default function InlineNameEditor({
  name,
  onSave,
  placeholder = "Untitled",
  size = "lg",
  className,
  textClassName,
  inputClassName,
  showEditButton = true,
  saveOnBlur = true,
  fallback = "Untitled",
  isEditing,
  onEditingChange,
  disabled = false,
  ...rest
}: InlineNameEditorProps) {
  const [internalEditing, setInternalEditing] = React.useState(false);
  const editing = isEditing ?? internalEditing;
  const setEditing = onEditingChange ?? setInternalEditing;

  const [value, setValue] = React.useState(name);
  React.useEffect(() => {
    if (!editing) setValue(name);
  }, [name, editing]);

  const doSave = () => {
    const next = (value ?? "").trim() || fallback;
    if (next !== name) onSave(next);
    setEditing(false);
  };

  const doCancel = () => {
    setValue(name);
    setEditing(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      doCancel();
    }
  };

  return (
    <div className={cn("flex items-center gap-2 min-w-0", className)} {...rest}>
      <AnimatePresence mode="wait" initial={false}>
        {editing ? (
          <motion.div
            key="editing"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 min-w-0"
          >
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={saveOnBlur ? doSave : undefined}
              autoFocus
              placeholder={placeholder}
              className={cn(
                sizeInput[size],
                weightText,
                "h-auto bg-transparent border-none shadow-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
                inputClassName
              )}
              aria-label={rest["aria-label"] ?? "Edit name"}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={doSave}
              className="text-foreground hover:text-foreground/90"
              aria-label="Save"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={doCancel}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Cancel"
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 min-w-0"
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => !disabled && setEditing(true)}
              className={cn(
                sizeText[size],
                weightText,
                "truncate text-left cursor-pointer hover:text-muted-foreground transition-colors disabled:cursor-default",
                "text-title"
              )}
              aria-label={rest["aria-label"] ?? "Edit name"}
              title="Click to edit"
            >
              {name || fallback}
            </button>
            {showEditButton && !disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setEditing(true)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
