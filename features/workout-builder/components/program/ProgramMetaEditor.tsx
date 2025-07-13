"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Program, ProgramGoal } from "@/types/Workout";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit3 } from "lucide-react";
import { useState } from "react";
import { ProgramNotesModal } from "./ProgramNotesModal";
import { ProgramSettingsModal } from "./ProgramSettingsModal";

interface ProgramMetaEditorProps {
  program: Program;
  onChange: (
    fields: Partial<{ name: string; description: string; goal: ProgramGoal }>
  ) => void;
  onSwitchMode: (updated: Program) => void;
}

export const ProgramMetaEditor = ({
  program,
  onChange,
  onSwitchMode,
}: ProgramMetaEditorProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(program.name);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  const handleSave = () => {
    const trimmed = tempName.trim();
    if (trimmed) {
      onChange({ name: trimmed });
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    submit: () => void,
    cancel: () => void
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      cancel();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2">
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
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) =>
                handleKeyDown(e, handleSave, () => {
                  setTempName(program.name);
                  setIsEditingName(false);
                })
              }
              className="text-xl font-bold border-none bg-transparent shadow-none h-auto focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
              placeholder="Program Name"
              autoFocus
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
            <h1
              className="text-xl font-bold cursor-pointer hover:text-muted-foreground transition-colors"
              onClick={() => setIsEditingName(true)}
            >
              {program.name || "Untitled Program"}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setIsEditingName(true)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <ProgramNotesModal
          open={notesOpen}
          onOpenChange={setNotesOpen}
          value={program.description}
          onChange={(desc) => onChange({ ...program, description: desc })}
        />
        <ProgramSettingsModal
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          program={program}
          onChange={onChange}
          onSwitchMode={onSwitchMode}
        />
      </div>
    </div>
  );
};
