"use client";

import { NotesPopover } from "@/components/NotesPopover";
import { SmartInput } from "@/components/SmartInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { TrackingType } from "@/types/Exercise";
import type {
  IntensitySystem,
  SetInfo,
  WorkoutExercise,
} from "@/types/Workout";
import { getMaxAllowedPercent1RM } from "@/utils/etl";
import {
  addSet,
  removeSet,
  updateSet,
} from "@/utils/exercises/sets";
import { estimateExerciseDuration } from "@/utils/volume/estimateExerciseDuration";
import {
  Activity,
  AlertCircle,
  Clock,
  Hash,
  LucideIcon,
  Plus,
  RotateCcw,
  Settings,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ETLDisplay } from "../insights/EtlDisplay";
import { RepSchemePopover } from "./RepSchemePopover";
import { SetTypeSelector } from "./SetTypeSelector";

type IntensityOptions = {
  id: IntensitySystem;
  label: string;
  icon: LucideIcon;
  options: number[];
};

const intensityOptions: IntensityOptions[] = [
  { id: "rpe", label: "RPE", icon: Target, options: [6, 7, 8, 9, 10] },
  {
    id: "one_rep_max_percent",
    label: "%1RM",
    icon: Activity,
    options: [60, 65, 70, 75, 80, 85, 90, 95],
  },
  {
    id: "rir",
    label: "RIR",
    icon: Target,
    options: [1, 2, 3, 4, 5],
  },
  { id: "none", label: "Effort", icon: Settings, options: [] },
];

const ADVANCED_SET_CONFIG = {
  drop: {
    fields: [
      { label: "Drop %", key: "drop_percent", placeholder: "20" },
      { label: "Drop Sets", key: "drop_sets", placeholder: "2" },
    ],
  },
  cluster: {
    fields: [
      { label: "Cluster Reps", key: "cluster_reps", placeholder: "3" },
      { label: "Intra Rest (s)", key: "intra_rest", placeholder: "15" },
    ],
  },
  myo_reps: {
    fields: [
      { label: "Activation Reps", key: "activation_set_reps", placeholder: "12" },
      { label: "Mini Sets", key: "mini_sets", placeholder: "3" },
    ],
  },
  rest_pause: {
    fields: [
      { label: "Initial Reps", key: "initial_reps", placeholder: "8" },
      { label: "Pause (s)", key: "pause_duration", placeholder: "10" },
    ],
  },
} as const;

/** Number input that behaves like a text field — free typing, commits on blur/Enter. */
function CellInput({
  value,
  onChange,
  min,
  placeholder,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  placeholder?: string;
  className?: string;
}) {
  const [draft, setDraft] = useState(value === 0 ? "" : String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync when parent value changes (e.g. from undo, reset, or adding sets)
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setDraft(value === 0 ? "" : String(value));
    }
  }, [value]);

  const commit = useCallback(() => {
    const num = Number(draft);
    if (draft === "" || isNaN(num)) {
      onChange(0);
      setDraft("");
    } else {
      const clamped = min !== undefined ? Math.max(min, num) : num;
      onChange(clamped);
      setDraft(clamped === 0 ? "" : String(clamped));
    }
  }, [draft, min, onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={draft}
      placeholder={placeholder ?? "0"}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "" || /^\d+$/.test(v)) {
          setDraft(v);
        }
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      className={className}
    />
  );
}

export function ExpandedExerciseCard({
  order,
  onlyExercise,
  exercise,
  isDraggingAny,
  onRemove,
  onUpdateSets,
  onUpdateIntensity,
  trackingTypes,
  onUpdateNotes,
  normalizedETL,
}: {
  order: number;
  onlyExercise: boolean;
  exercise: WorkoutExercise;
  trackingTypes: TrackingType[];
  isDraggingAny: boolean;
  onRemove: () => void;
  onUpdateSets: (sets: SetInfo[]) => void;
  onUpdateIntensity: (intensity: IntensitySystem) => void;
  onUpdateNotes: (notes: string) => void;
  normalizedETL: number;
}) {
  // ---------- Local helpers ----------
  const sets = exercise.sets ?? [];
  const hasSets = sets.length > 0;

  const handleAddSet = () => {
    onUpdateSets(addSet(sets));
  };

  const handleAddSets = (count: number) => {
    let next = sets;
    for (let i = 0; i < count; i++) next = addSet(next);
    onUpdateSets(next);
  };

  const handleRemoveSet = (index: number) => {
    onUpdateSets(removeSet(sets, index));
  };

  const handleUpdateSet = (
    index: number,
    field: keyof SetInfo,
    value: SetInfo[keyof SetInfo]
  ) => {
    onUpdateSets(
      updateSet(sets, index, {
        ...sets[index],
        [field]: value,
      })
    );
  };

  const IntensityIcon = intensityOptions.find(
    (o) => o.id === exercise.intensity
  )?.icon;
  const currentIntensity = exercise.intensity;

  const totalReps = sets.reduce((sum, s) => sum + (s.reps ?? 0), 0);
  const estimatedTime = Math.ceil(estimateExerciseDuration(exercise) / 60);

  return (
    <Card
      className={cn(
        "group relative bg-white dark:bg-background transition-all duration-300 py-2",
        onlyExercise ? "border-none shadow-none" : "border border-border"
      )}
    >
      {/* Header */}
      <CardHeader className="px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-muted rounded-md flex items-center justify-center">
              <span className="text-[10px] font-bold text-muted-foreground">
                {order + 1}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-semibold leading-tight">{exercise.display_name}</h3>
                <NotesPopover
                  title="Exercise Notes"
                  onSave={onUpdateNotes}
                  value={exercise.notes || ""}
                  placeholder="Add notes about form, technique, or modifications..."
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  <RotateCcw className="w-3 h-3" />
                  <span>{totalReps} reps</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{estimatedTime} min</span>
                </div>
                <ETLDisplay normalizedETL={normalizedETL} />
              </div>
            </div>
          </div>

          {!isDraggingAny && (
            <div className="flex items-center gap-1">
              <Select
                value={exercise.intensity}
                onValueChange={(v) => onUpdateIntensity(v as IntensitySystem)}
              >
                <SelectTrigger className="h-7 text-xs w-auto min-w-[90px] gap-1.5">
                  <SelectValue placeholder="Intensity" />
                </SelectTrigger>
                <SelectContent>
                  {intensityOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      <div className="flex items-center gap-2">
                        <o.icon className="w-4 h-4" />
                        {o.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                title="Remove exercise"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-0 py-0 space-y-1">
        {!hasSets && (
          <div
            className="rounded-lg border-2 border-dashed border-border/70 bg-muted/20 px-4 py-3 text-center mx-3"
            aria-live="polite"
          >
            <p className="text-sm text-muted-foreground mb-2">
              No sets yet for{" "}
              <span className="font-medium">{exercise.display_name}</span>.
            </p>
            <div className="flex items-center justify-center gap-1.5">
              <Button size="sm" onClick={() => handleAddSets(1)}>
                <Plus className="w-3 h-3 mr-1" />
                Add first set
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddSets(3)}
              >
                + 3 sets
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddSets(5)}
              >
                + 5 sets
              </Button>
            </div>
          </div>
        )}

        {/* Spreadsheet table */}
        {hasSets && (
          <div>
            {/* Header row */}
            <div className="flex items-stretch">
              <div className="w-7 flex-shrink-0" />
              <div className="flex-1 grid grid-cols-4 border border-border rounded-t-lg bg-muted/30">
                <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Type</div>
                <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-l border-border flex items-center gap-1">
                  <Hash className="w-3 h-3" /> Reps
                </div>
                <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-l border-border flex items-center gap-1">
                  {IntensityIcon && <IntensityIcon className="w-3 h-3" />}
                  {intensityOptions.find((o) => o.id === exercise.intensity)?.label}
                </div>
                <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-l border-border flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Rest
                </div>
              </div>
              <div className="w-8 flex-shrink-0" />
            </div>

            {/* Data rows */}
            {sets.map((set, i) => {
              const advancedConfig = ADVANCED_SET_CONFIG[set.set_type as keyof typeof ADVANCED_SET_CONFIG];
              const isLastRow = i === sets.length - 1;
              const hasWarning = sets.some(
                (s) =>
                  exercise.intensity === "one_rep_max_percent" &&
                  s.reps != null &&
                  s.one_rep_max_percent != null &&
                  s.one_rep_max_percent > getMaxAllowedPercent1RM(s.reps)
              );
              const isLastBorder = isLastRow && !hasWarning;

              return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="group/set"
              >
                {/* Main row */}
                <div className="flex items-stretch">
                  {/* Set number — outside table */}
                  <div className="w-7 flex-shrink-0 flex items-center justify-center">
                    <span className="text-[11px] text-muted-foreground font-medium tabular-nums">
                      {i + 1}
                    </span>
                  </div>

                  {/* Table cells */}
                  <div
                    className={cn(
                      "flex-1 grid grid-cols-4 border-x border-b border-border hover:bg-muted/20 transition-colors",
                      isLastBorder && !advancedConfig && "rounded-b-lg"
                    )}
                  >
                    {/* Type */}
                    <div className="flex items-stretch">
                      <SetTypeSelector
                        setType={set.set_type}
                        onSetTypeChange={(type) =>
                          handleUpdateSet(i, "set_type", type)
                        }
                        cellMode
                      />
                    </div>

                    {/* Reps cell — per-set popover */}
                    <div className="border-l border-border flex items-center">
                      <RepSchemePopover
                        set={set}
                        trackingTypes={trackingTypes}
                        onApply={(updated) => {
                          onUpdateSets(
                            sets.map((s, idx) => (idx === i ? updated : s))
                          );
                        }}
                      />
                    </div>

                    {/* Intensity */}
                    <div className="border-l border-border flex items-center">
                      {currentIntensity !== "none" ? (
                        <SmartInput
                          value={
                            set.rpe ?? set.rir ?? set.one_rep_max_percent ?? ""
                          }
                          options={
                            intensityOptions.find(
                              (o) => o.id === currentIntensity
                            )?.options || []
                          }
                          onChange={(val) => {
                            handleUpdateSet(
                              i,
                              currentIntensity as keyof SetInfo,
                              val
                            );
                          }}
                          cellMode
                        />
                      ) : (
                        <span className="px-2 py-1 text-xs text-muted-foreground">–</span>
                      )}
                    </div>

                    {/* Rest */}
                    <div className="border-l border-border flex items-center">
                      <SmartInput
                        value={set.rest || 60}
                        options={[15, 30, 45, 60, 75, 90, 105, 120]}
                        onChange={(val) => handleUpdateSet(i, "rest", val)}
                        customLabel="Custom rest..."
                        badgeLabel="Rest"
                        cellMode
                      />
                    </div>
                  </div>

                  {/* Delete — outside table */}
                  <div className="w-8 flex-shrink-0 flex items-center justify-center opacity-0 group-hover/set:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSet(i)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                      title="Remove set"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Advanced fields sub-row */}
                {advancedConfig && (
                  <div className="flex items-stretch">
                    <div className="w-7 flex-shrink-0" />
                    <div
                      className={cn(
                        "flex-1 border-x border-b border-border bg-muted/10",
                        isLastBorder && "rounded-b-lg"
                      )}
                    >
                      <div className="flex items-center divide-x divide-border">
                        {advancedConfig.fields.map((field) => (
                          <div key={field.key} className="flex-1 flex items-center">
                            <span className="px-1.5 py-1 text-[11px] text-muted-foreground whitespace-nowrap">
                              {field.label}
                            </span>
                            <CellInput
                              value={(set as Record<string, unknown>)[field.key] as number ?? 0}
                              onChange={(v) =>
                                handleUpdateSet(i, field.key as keyof SetInfo, v)
                              }
                              min={0}
                              placeholder={field.placeholder}
                              className="h-full w-16 bg-transparent text-center text-sm font-medium outline-none placeholder:text-muted-foreground"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-8 flex-shrink-0" />
                  </div>
                )}
              </motion.div>
              );
            })}

            {/* 1RM warning */}
            {sets.some(
              (set) =>
                exercise.intensity === "one_rep_max_percent" &&
                set.reps != null &&
                set.one_rep_max_percent != null &&
                set.one_rep_max_percent > getMaxAllowedPercent1RM(set.reps)
            ) && (
              <div className="flex items-stretch">
                <div className="w-7 flex-shrink-0" />
                <div className="flex-1 px-2 py-1.5 bg-destructive/5 border-x border-b border-border rounded-b-lg flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-destructive flex-shrink-0" />
                  <p className="text-[11px] text-destructive">
                    One or more sets exceed the safe %1RM range for the given reps. Try lowering the % or reps.
                  </p>
                </div>
                <div className="w-8 flex-shrink-0" />
              </div>
            )}
          </div>
        )}

        {/* Add set */}
        {hasSets && (
          <div className="flex items-stretch">
            <div className="w-7 flex-shrink-0" />
            <button
              onClick={() => handleAddSets(1)}
              className="flex-1 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <div className="w-8 flex-shrink-0" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
