"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FileText, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

interface NotesPopoverProps {
  value: string;
  title: string;
  onSave: (notes: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export function NotesPopover({
  value,
  title,
  onSave,
  placeholder = "Add notes about this workout day...",
  maxLength = 500,
  className,
}: NotesPopoverProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setLocalValue(value);
    setHasUnsavedChanges(false);
  }, [value]);

  useEffect(() => {
    setHasUnsavedChanges(localValue.trim() !== value.trim());
  }, [localValue, value]);

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;

    setIsSaving(true);
    onSave(localValue.trim());
    setIsSaving(false);
    setHasUnsavedChanges(false);
    setIsOpen(false);
  };

  const handleDiscard = () => {
    setLocalValue(value);
    setHasUnsavedChanges(false);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleDiscard();
    }
  };

  const characterCount = localValue.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative transition-all duration-200",
            value && "text-primary ",
            className
          )}
        >
          <FileText className="w-4 h-4" />
          {value && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-0 shadow-lg border-0 bg-background/95 backdrop-blur-sm"
        align="end"
        sideOffset={8}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-medium text-sm">{title}</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-background"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <div className="relative">
              <Textarea
                autoFocus
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={cn(
                  "min-h-[120px] resize-none border-0 bg-muted/20 focus:bg-background transition-colors",
                  "placeholder:text-muted-foreground/60",
                  isOverLimit && "border-destructive focus:border-destructive"
                )}
                maxLength={maxLength}
              />

              {/* Character count */}
              <div
                className={cn(
                  "absolute bottom-2 right-2 text-xs transition-colors",
                  isOverLimit
                    ? "text-destructive"
                    : isNearLimit
                    ? "text-warning"
                    : "text-muted-foreground"
                )}
              >
                {characterCount}/{maxLength}
              </div>
            </div>

            {/* Helper text */}
            <p className="text-xs text-muted-foreground">
              Press{" "}
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd>{" "}
              to save
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t bg-muted/30">
            <AnimatePresence mode="wait">
              {hasUnsavedChanges && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 bg-warning rounded-full" />
                  Unsaved changes
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2 ml-auto">
              {hasUnsavedChanges && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDiscard}
                  className="text-xs h-7"
                >
                  Discard
                </Button>
              )}

              <Button
                size="sm"
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isSaving || isOverLimit}
                className="text-xs h-7 min-w-[60px]"
              >
                <AnimatePresence mode="wait">
                  {isSaving ? (
                    <motion.div
                      key="saving"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1"
                    >
                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      Saving
                    </motion.div>
                  ) : hasUnsavedChanges ? (
                    <motion.div
                      key="save"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      Save
                    </motion.div>
                  ) : (
                    <motion.div
                      key="saved"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Saved
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
