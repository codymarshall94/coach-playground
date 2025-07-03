"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Program, ProgramDay } from "@/types/Workout";
import { Check, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DayNameEditorProps {
  program: Program;
  activeBlockIndex: number;
  activeDayIndex: number;
  editedName: string;
  setEditedName: (name: string) => void;
  updateDayDetails: (updates: Partial<ProgramDay>) => void;
  setIsEditingName: (isEditing: boolean) => void;
  isEditingName: boolean;
}

export const DayNameEditor = ({
  program,
  activeBlockIndex,
  activeDayIndex,
  editedName,
  setEditedName,
  updateDayDetails,
  setIsEditingName,
  isEditingName,
}: DayNameEditorProps) => {
  const currentName =
    program.mode === "blocks"
      ? program.blocks?.[activeBlockIndex]?.days?.[activeDayIndex]?.name
      : program.days?.[activeDayIndex]?.name;

  const handleSave = () => {
    updateDayDetails({ name: editedName.trim() || "Untitled Day" });
    setIsEditingName(false);
  };

  return (
    <div className="flex items-center gap-2 min-w-0">
      <AnimatePresence mode="wait" initial={false}>
        {isEditingName ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-xl font-semibold border-none bg-transparent p-0 h-auto focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
              placeholder="Day name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setIsEditingName(false);
              }}
              onBlur={handleSave}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className="text-green-600 hover:text-green-700"
            >
              <Check className="w-4 h-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <h2 className="text-xl font-semibold truncate">{currentName}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditedName(currentName || "");
                setIsEditingName(true);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
