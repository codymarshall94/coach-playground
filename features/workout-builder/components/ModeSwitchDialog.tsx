"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Program, ProgramBlock, ProgramDay } from "@/types/Workout";
import { useState } from "react";

type Props = {
  currentProgram: Program;
  onSwitchMode: (updated: Program) => void;
};

export function ModeSwitchDialog({ currentProgram, onSwitchMode }: Props) {
  const [open, setOpen] = useState(false);
  const [targetMode, setTargetMode] = useState<"blocks" | "days" | null>(null);

  const handleSwitch = () => {
    const prev = currentProgram;

    if (targetMode === "days" && prev.blocks) {
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

    if (targetMode === "blocks" && prev.days) {
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

    setOpen(false);
  };

  const promptSwitch = (mode: "blocks" | "days") => {
    if (mode !== currentProgram.mode) {
      setTargetMode(mode);
      setOpen(true);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Format:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            promptSwitch(currentProgram.mode === "blocks" ? "days" : "blocks")
          }
        >
          {currentProgram.mode === "blocks" ? "Blocks" : "Days"}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch Program Mode?</DialogTitle>
          </DialogHeader>
          <div className="text-sm space-y-2">
            <p>
              You’re about to switch from <strong>{currentProgram.mode}</strong>{" "}
              mode to <strong>{targetMode}</strong> mode.
            </p>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>
                Switching to <b>Blocks</b> wraps your current days into one
                block.
              </li>
              <li>
                Switching to <b>Days</b> flattens your blocks and removes all
                block-specific info.
              </li>
            </ul>
            <p className="text-red-600">
              This change cannot be undone. Continue?
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSwitch}>
              Switch to {targetMode}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
