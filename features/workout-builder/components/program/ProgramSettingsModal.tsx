"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type {
  Program,
  ProgramBlock,
  ProgramDay,
  ProgramGoal,
} from "@/types/Workout";
import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";

type ProgramSettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program;
  onChange: (updated: Program) => void;
  onSwitchMode: (updated: Program) => void;
};

export const ProgramSettingsModal = ({
  open,
  onOpenChange,
  program,
  onChange,
  onSwitchMode,
}: ProgramSettingsModalProps) => {
  const usingBlocks = program.mode === "blocks";

  const handleSwitch = () => {
    const prev = program;

    if (usingBlocks && prev.blocks) {
      const mergedDays: ProgramDay[] = prev.blocks
        .flatMap((block) => block.days)
        .map((day, i) => ({ ...day, order: i }));

      onSwitchMode({
        ...prev,
        mode: "days",
        blocks: undefined,
        days: mergedDays,
      });
    }

    if (!usingBlocks && prev.days) {
      const block: ProgramBlock = {
        id: crypto.randomUUID(),
        name: "Block 1",
        order: 0,
        days: prev.days.map((day, i) => ({ ...day, order: i })),
      };

      onSwitchMode({
        ...prev,
        mode: "blocks",
        days: undefined,
        blocks: [block],
      });
    }

    onOpenChange(false);
  };

  const nextMode = usingBlocks ? "Days" : "Blocks";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl">
        <DialogTitle>Program Settings</DialogTitle>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* === FORMAT SWITCH === */}
          <div className="space-y-2">
            <Label className="text-sm">Format</Label>
            <div className="flex items-center gap-4">
              <Switch checked={usingBlocks} onCheckedChange={handleSwitch} />
              <Label className="text-muted-foreground">
                Switch to {nextMode}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Current format: <strong>{usingBlocks ? "Blocks" : "Days"}</strong>
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              {usingBlocks
                ? "Days mode lets you organize days into a single list."
                : "Blocks mode lets you organize days into multi-week blocks for more complex training."}
            </p>
            <p className="text-xs text-destructive max-w-sm">
              {usingBlocks
                ? "Switching to Days flattens your blocks and removes all block-specific info."
                : "Switching to Blocks wraps your current days into one block."}
              <br />
              This change cannot be undone.
            </p>
          </div>

          {/* === GOAL === */}
          <div className="space-y-2">
            <Label className="text-sm">Goal</Label>
            <Select
              value={program.goal}
              onValueChange={(value) =>
                onChange({ ...program, goal: value as ProgramGoal })
              }
            >
              <SelectTrigger>
                <span className="capitalize">{program.goal}</span>
              </SelectTrigger>
              <SelectContent>
                {["strength", "hypertrophy", "endurance", "power"].map((g) => (
                  <SelectItem key={g} value={g} className="capitalize">
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
