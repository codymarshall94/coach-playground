"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Program, ProgramGoal } from "@/types/Workout";
import { motion } from "framer-motion";
import { Edit3, Settings2 } from "lucide-react";
import { useState } from "react";
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

  const handleNameSubmit = () => {
    onChange({ name: tempName });
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
      <div className="flex items-center gap-2">
        {isEditingName ? (
          <motion.div
            key="name-edit"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) =>
                handleKeyDown(e, handleNameSubmit, () => {
                  setTempName(program.name);
                  setIsEditingName(false);
                })
              }
              className="text-xl font-bold border-none shadow-none p-0 h-auto focus-visible:ring-1 focus-visible:ring-offset-0"
              autoFocus
            />
          </motion.div>
        ) : (
          <h1
            className="text-xl font-bold cursor-pointer hover:text-muted-foreground transition-colors"
            onClick={() => setIsEditingName(true)}
          >
            {program.name || "Untitled Program"}
          </h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
          onClick={() => setIsEditingName(true)}
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSettingsOpen(true)}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
      >
        <Settings2 className="w-4 h-4" />
        <span className="text-sm">Program Settings</span>
      </Button>

      <ProgramSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        program={program}
        onChange={onChange}
        onSwitchMode={onSwitchMode}
      />
    </div>
  );
};
