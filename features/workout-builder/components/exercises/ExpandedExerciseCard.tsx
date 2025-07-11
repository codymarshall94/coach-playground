"use client";

import { NotesPopover } from "@/components/NotesPopover";
import { SmartInput } from "@/components/SmartInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { intensityConfig } from "@/config/intensityConfig";
import type {
  IntensitySystem,
  SetInfo,
  SetType,
  WorkoutExercise,
} from "@/types/Workout";
import { getMaxAllowedPercent1RM } from "@/utils/etl";
import { estimateExerciseDuration } from "@/utils/volume/estimateExerciseDuration";
import {
  Activity,
  AlertCircle,
  Clock,
  Copy,
  Plus,
  RotateCcw,
  Settings,
  Target,
  Timer,
  Trash2,
  Weight,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ETLDisplay } from "../insights/EtlDisplay";
import { AdvancedSetFields } from "./AdvancedSetFields";
import { SET_TYPE_CONFIG, SetTypeSelector } from "./SetTypeSelector";

const intensityLabel: Record<IntensitySystem, string> = {
  rpe: "RPE",
  one_rep_max_percent: "%1RM",
  rir: "RIR",
  none: "Effort",
};

const intensityIcons: Record<IntensitySystem, any> = {
  rpe: Target,
  one_rep_max_percent: Activity,
  rir: Target,
  none: Settings,
};

export function ExpandedExerciseCard({
  order,
  exercise,
  isDraggingAny,
  onRemove,
  onUpdateSets,
  onUpdateIntensity,
  onUpdateNotes,
  normalizedETL,
}: {
  order: number;
  exercise: WorkoutExercise;
  isDraggingAny: boolean;
  onRemove: () => void;
  onUpdateSets: (sets: WorkoutExercise["sets"]) => void;
  onUpdateIntensity: (intensity: IntensitySystem) => void;
  onUpdateNotes: (notes: string) => void;
  normalizedETL: number;
}) {
  const [tempNotes, setTempNotes] = useState(exercise.notes || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const addSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet = {
      reps: lastSet?.reps || 8,
      rest: lastSet?.rest || 90,
      rpe: null,
      rir: null,
      one_rep_max_percent: null,
      set_type: "standard" as SetType,
    };
    onUpdateSets([...exercise.sets, newSet]);
  };

  const removeSet = (index: number) => {
    onUpdateSets(exercise.sets.filter((_, i) => i !== index));
  };

  const updateSet = (
    index: number,
    field: keyof WorkoutExercise["sets"][0],
    value: any
  ) => {
    const updated = [...exercise.sets];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateSets(updated);
  };

  const duplicateSet = (index: number) => {
    const setToDuplicate = exercise.sets[index];
    const newSet = { ...setToDuplicate };
    const updated = [...exercise.sets];
    updated.splice(index + 1, 0, newSet);
    onUpdateSets(updated);
  };

  const totalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0);
  const estimatedTime = Math.ceil(estimateExerciseDuration(exercise) / 60);
  const IntensityIcon = intensityIcons[exercise.intensity];

  const currentIntensity = exercise.intensity;
  const { label, options } =
    intensityConfig[currentIntensity as keyof typeof intensityConfig];

  return (
    <Card className="group relative bg-background border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 border-2 border-primary/20 rounded-xl flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {order + 1}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground text-xl mb-1">
                  {exercise.name}
                </h3>
                <NotesPopover
                  title="Exercise Notes"
                  onSave={onUpdateNotes}
                  value={exercise.notes || ""}
                  placeholder="Add notes about form, technique, or modifications..."
                />
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <RotateCcw className="w-4 h-4" />
                  <span>{totalReps} reps</span>
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4" />
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
                <SelectTrigger className="h-9 w-auto min-w-[100px] gap-2">
                  <SelectValue placeholder="Intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rpe">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      RPE
                    </div>
                  </SelectItem>
                  <SelectItem value="one_rep_max_percent">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      %1RM
                    </div>
                  </SelectItem>
                  <SelectItem value="rir">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      RIR
                    </div>
                  </SelectItem>
                  <SelectItem value="none">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      None
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Weight className="w-4 h-4" />
              Sets ({exercise.sets.length})
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={addSet}
              className="h-8 px-3 text-xs bg-transparent"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Set
            </Button>
          </div>

          <div className="space-y-2">
            {exercise.sets.map((set, i) => (
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
                    <div className="flex items-center gap-2">
                      <SetTypeSelector
                        setType={set.set_type}
                        onSetTypeChange={(type) =>
                          updateSet(i, "set_type", type)
                        }
                        trigger={
                          <Badge
                            variant="secondary"
                            className="text-xs px-3 py-1 cursor-pointer"
                          >
                            Set {i + 1} · {SET_TYPE_CONFIG[set.set_type].label}
                          </Badge>
                        }
                      />
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
                    <div className="flex items-center gap-1 opacity-0 group-hover/set:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateSet(i)}
                        className="h-7 w-7 p-0"
                        title="Duplicate set"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSet(i)}
                        disabled={exercise.sets.length === 1}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                        title="Remove set"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" />
                        Reps
                      </Label>
                      <Input
                        type="number"
                        value={set.reps}
                        onChange={(e) =>
                          updateSet(i, "reps", Number(e.target.value))
                        }
                        className="h-9 text-center font-medium"
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <IntensityIcon className="w-3 h-3" />
                        {intensityLabel[exercise.intensity]}
                      </Label>
                      <SmartInput
                        value={
                          set.rpe ?? set.rir ?? set.one_rep_max_percent ?? ""
                        }
                        options={options}
                        onChange={(val) => {
                          updateSet(i, currentIntensity as keyof SetInfo, val);
                        }}
                        disabled={currentIntensity === "none"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Rest (sec)
                      </Label>
                      <SmartInput
                        value={set.rest}
                        options={[15, 30, 45, 60, 75, 90, 105, 120]}
                        onChange={(val) => updateSet(i, "rest", val)}
                      />
                    </div>
                  </div>

                  <AdvancedSetFields
                    set={set}
                    index={i}
                    updateSet={updateSet}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
