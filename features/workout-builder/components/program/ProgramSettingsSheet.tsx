"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type {
  Program,
  ProgramBlock,
  ProgramDay,
  ProgramGoal,
} from "@/types/Workout";
import { getAllBlockDays } from "@/utils/program/weekHelpers";
import { motion } from "framer-motion";
import { ImagePlus, Settings2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Cover image validation                                                    */
/* -------------------------------------------------------------------------- */

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function validateCoverImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "File type not supported. Please use JPG, PNG, WebP, or GIF.";
  }
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return `File is too large (${sizeMB} MB). Maximum size is 5 MB.`;
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Default gradient backgrounds (used when no cover image is set)            */
/* -------------------------------------------------------------------------- */

export const PROGRAM_GRADIENTS: Record<ProgramGoal, string> = {
  strength:
    "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)",
  hypertrophy:
    "linear-gradient(135deg, #042f2e 0%, #065f46 50%, #10b981 100%)",
  endurance:
    "linear-gradient(135deg, #0c1a2e 0%, #1e3a5f 50%, #3b82f6 100%)",
  power:
    "linear-gradient(135deg, #2d1810 0%, #78350f 50%, #f59e0b 100%)",
};

/* -------------------------------------------------------------------------- */
/*  Props                                                                     */
/* -------------------------------------------------------------------------- */

interface ProgramSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program;
  onChange: (updated: Partial<Program>) => void;
  onSwitchMode: (updated: Program) => void;
  /** Called with the raw File when the user picks a cover image, or null to clear. */
  onPendingCoverFile?: (file: File | null) => void;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const ProgramSettingsSheet = ({
  open,
  onOpenChange,
  program,
  onChange,
  onSwitchMode,
  onPendingCoverFile,
}: ProgramSettingsSheetProps) => {
  const usingBlocks = program.mode === "blocks";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  /* ---- Mode switch ---- */
  const handleSwitch = () => {
    const prev = program;

    if (usingBlocks && prev.blocks) {
      const mergedDays: ProgramDay[] = prev.blocks
        .flatMap((block) => getAllBlockDays(block))
        .map((day, i) => ({ ...day, order_num: i }));

      onSwitchMode({
        ...prev,
        mode: "days",
        blocks: undefined,
        days: mergedDays,
      });
    }

    if (!usingBlocks && prev.days) {
      const days = prev.days.map((day, i) => ({ ...day, order_num: i }));
      const block: ProgramBlock = {
        id: crypto.randomUUID(),
        name: "Block 1",
        order_num: 0,
        days,
        weeks: [{ id: crypto.randomUUID(), weekNumber: 1, label: "Week 1", days }],
      };

      onSwitchMode({
        ...prev,
        mode: "blocks",
        days: undefined,
        blocks: [block],
      });
    }
  };

  /* ---- Image pick (local preview only — upload deferred to save) ---- */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Client-side validation
      const validationError = validateCoverImage(file);
      if (validationError) {
        setImageError(validationError);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setImageError(null);

      // Revoke any previous blob URL to avoid memory leaks
      if (program.cover_image?.startsWith("blob:")) {
        URL.revokeObjectURL(program.cover_image);
      }

      const blobUrl = URL.createObjectURL(file);
      onChange({ cover_image: blobUrl });
      onPendingCoverFile?.(file);

      // Reset so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [program.cover_image, onChange, onPendingCoverFile]
  );

  const handleRemoveImage = useCallback(() => {
    if (!program.cover_image) return;

    // Revoke blob URL if local
    if (program.cover_image.startsWith("blob:")) {
      URL.revokeObjectURL(program.cover_image);
    }

    onChange({ cover_image: null });
    onPendingCoverFile?.(null);
  }, [program.cover_image, onChange, onPendingCoverFile]);

  const nextMode = usingBlocks ? "Days" : "Blocks";
  const gradient = PROGRAM_GRADIENTS[program.goal];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Program Settings</SheetTitle>
          <SheetDescription>
            Customize cover image, goal, and format.
          </SheetDescription>
        </SheetHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 px-4 pb-6"
        >
          {/* ============ COVER IMAGE ============ */}
          <div className="space-y-3">
            <Label className="text-sm">Cover Image</Label>

            {/* Preview */}
            <div
              className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-border/50"
              style={
                !program.cover_image ? { background: gradient } : undefined
              }
            >
              {program.cover_image ? (
                <Image
                  src={program.cover_image}
                  alt="Program cover"
                  fill
                  className="object-cover"
                  sizes="(max-width: 448px) 100vw, 448px"
                  unoptimized={program.cover_image.startsWith("blob:")}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
                  <ImagePlus className="w-8 h-8 mb-1" />
                  <span className="text-xs font-medium">Default gradient</span>
                </div>
              )}


            </div>

            {/* Upload / Remove buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Upload image
              </Button>

              {program.cover_image && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif"
              className="hidden"
              onChange={handleFileChange}
            />

            {imageError && (
              <p className="text-xs text-destructive">{imageError}</p>
            )}

            <p className="text-xs text-muted-foreground">
              Max 5 MB. JPG, PNG, WebP or GIF.
            </p>
          </div>

          {/* ============ GOAL ============ */}
          <div className="space-y-2">
            <Label className="text-sm">Goal</Label>
            <Select
              value={program.goal}
              onValueChange={(value) =>
                onChange({ goal: value as ProgramGoal })
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

          {/* ============ FORMAT SWITCH ============ */}
          <div className="space-y-2">
            <Label className="text-sm">Format</Label>
            <div className="flex items-center gap-4">
              <Switch checked={usingBlocks} onCheckedChange={handleSwitch} />
              <Label className="text-muted-foreground">
                Switch to {nextMode}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Current format:{" "}
              <strong>{usingBlocks ? "Blocks" : "Days"}</strong>
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
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};
