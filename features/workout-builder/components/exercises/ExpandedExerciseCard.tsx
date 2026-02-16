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
import type {
  IntensitySystem,
  SetInfo,
  WorkoutExercise,
} from "@/types/Workout";
import { getMaxAllowedPercent1RM } from "@/utils/etl";
import {
  addSet,
  duplicateSet,
  removeSet,
  updateSet,
} from "@/utils/exercises/sets";
import { estimateExerciseDuration } from "@/utils/volume/estimateExerciseDuration";
import {
  Activity,
  AlertCircle,
  Clock,
  Copy,
  LucideIcon,
  Plus,
  RotateCcw,
  Settings,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { ETLDisplay } from "../insights/EtlDisplay";
import { AdvancedSetFields } from "./AdvancedSetFields";
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

export function ExpandedExerciseCard({
  order,
  onlyExercise,
  exercise,
  isDraggingAny,
  onRemove,
  onUpdateSets,
  onUpdateIntensity,
  onUpdateNotes,
  normalizedETL,
}: {
  order: number;
  onlyExercise: boolean;
  exercise: WorkoutExercise;
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

  const handleDuplicateSet = (index: number) => {
    onUpdateSets(duplicateSet(sets, index));
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
        "group relative bg-white dark:bg-background transition-all duration-300",
        onlyExercise ? "border-none shadow-none" : "border border-border"
      )}
    >
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <span className="text-sm font-bold text-muted-foreground">
                {order + 1}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-title">{exercise.display_name}</h3>
                <NotesPopover
                  title="Exercise Notes"
                  onSave={onUpdateNotes}
                  value={exercise.notes || ""}
                  placeholder="Add notes about form, technique, or modifications..."
                />
              </div>

              <div className="flex items-center gap-3 text-meta">
                <div className="flex items-center gap-1">
                  <RotateCcw className="w-4 h-4" />
                  <span>{totalReps} reps</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{estimatedTime} min</span>
                </div>
                <ETLDisplay normalizedETL={normalizedETL} />
              </div>
            </div>
          </div>

          {!isDraggingAny && (
            <div className="flex items-center gap-2">
              <Select
                value={exercise.intensity}
                onValueChange={(v) => onUpdateIntensity(v as IntensitySystem)}
              >
                <SelectTrigger className="h-9 w-auto min-w-[110px] gap-2">
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

      <CardContent className="space-y-4">
        {hasSets && (
          <div className="grid grid-cols-[60px_1fr_1fr_1fr_60px] gap-4 px-2 text-meta uppercase mb-1">
            <div className="flex items-center gap-1">Set</div>
            <div className="flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Reps
            </div>
            <div className="flex items-center gap-1">
              {IntensityIcon && <IntensityIcon className="w-3 h-3" />}
              {intensityOptions.find((o) => o.id === exercise.intensity)?.label}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Rest
            </div>
            <div />
          </div>
        )}

        {!hasSets && (
          <div
            className="rounded-lg border-2 border-dashed border-border/70 bg-muted/20 p-6 text-center"
            aria-live="polite"
          >
            <p className="text-sm text-muted-foreground mb-3">
              No sets yet for{" "}
              <span className="font-medium">{exercise.display_name}</span>.
            </p>
            <div className="flex items-center justify-center gap-2">
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

        {/* Sets list */}
        {hasSets && (
          <div className="space-y-2">
            {sets.map((set, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="group/set"
              >
                <div className="bg-muted/30 hover:bg-muted/50 rounded-lg p-4 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    {exercise.intensity === "one_rep_max_percent" &&
                      set.reps != null &&
                      set.one_rep_max_percent != null &&
                      set.one_rep_max_percent >
                        getMaxAllowedPercent1RM(set.reps) && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-destructive" />
                          <p className="text-xs text-destructive">
                            {set.reps} reps at {set.one_rep_max_percent}% 1RM
                            exceeds safe range. Try lowering the % or reps.
                          </p>
                        </div>
                      )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[60px_1fr_1fr_1fr_60px] gap-4">
                    <div className="col-span-1 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-bold">
                        {i + 1}
                      </span>
                      <SetTypeSelector
                        setType={set.set_type}
                        onSetTypeChange={(type) =>
                          handleUpdateSet(i, "set_type", type)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        type="number"
                        value={set.reps ?? 0}
                        onChange={(e) =>
                          handleUpdateSet(i, "reps", Number(e.target.value))
                        }
                        className="h-9 text-center font-medium"
                        min={0}
                      />
                    </div>

                    {currentIntensity !== "none" ? (
                      <div className="space-y-2">
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
                        />
                      </div>
                    ) : (
                      <div />
                    )}

                    <div className="space-y-2">
                      <SmartInput
                        value={set.rest || 60}
                        options={[15, 30, 45, 60, 75, 90, 105, 120]}
                        onChange={(val) => handleUpdateSet(i, "rest", val)}
                        customLabel="Custom rest..."
                        badgeLabel="Rest"
                      />
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover/set:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicateSet(i)}
                        className="h-7 w-7 p-0"
                        title="Duplicate set"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSet(i)}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                        title="Remove set"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <AdvancedSetFields
                    set={set}
                    index={i}
                    updateSet={handleUpdateSet}
                  />
                </div>
              </motion.div>
            ))}

            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddSets(1)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add another
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddSets(3)}
              >
                + 3 more
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
