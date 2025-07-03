"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type {
  Program,
  ProgramBlock,
  ProgramDay,
  ProgramGoal,
} from "@/types/Workout";
import { motion } from "framer-motion";

type ProgramSettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program;
  onChange: (updated: Program) => void;
  onSwitchMode: (updated: Program) => void;
};

const modes = [
  {
    label: "Blocks",
    description:
      "Blocks mode lets you organize days into multi-week blocks. 'Days' is simpler.",
    warning:
      "Switching to Blocks wraps your current days into one block. This change cannot be undone.",
  },
  {
    label: "Days",
    description: "Days mode lets you organize days into a single list.",
    warning:
      "Switching to Days flattens your blocks and removes all block-specific info. This change cannot be undone.",
  },
];

export const ProgramSettingsModal = ({
  open,
  onOpenChange,
  program,
  onChange,
  onSwitchMode,
}: ProgramSettingsModalProps) => {
  const usingBlocks = program.blocks?.length && program.blocks.length > 0;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle>Program Settings</DialogTitle>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="text-sm">Format</Label>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Switch
                  checked={!!usingBlocks}
                  onCheckedChange={handleSwitch}
                />
                <Label
                  htmlFor="format-switch"
                  className="text-muted-foreground"
                >
                  {usingBlocks ? "Blocks" : "Days"}
                </Label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm">
              {
                modes.find((m) => m.label === (usingBlocks ? "Blocks" : "Days"))
                  ?.description
              }
            </p>
            <p className="text-xs text-destructive max-w-sm">
              {
                modes.find((m) => m.label === (usingBlocks ? "Blocks" : "Days"))
                  ?.warning
              }
            </p>
          </div>

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

          <div className="space-y-2">
            <Label className="text-sm">Program Notes</Label>
            <Textarea
              placeholder="Optional notes, structure, tags, reminders..."
              rows={3}
              value={program.description}
              onChange={(e) =>
                onChange({ ...program, description: e.target.value })
              }
            />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
