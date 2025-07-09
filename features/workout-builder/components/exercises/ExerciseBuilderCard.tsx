"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchExerciseById } from "@/lib/supabase/exercises";
import { Exercise } from "@/types/Exercise";
import type { IntensitySystem, WorkoutExercise } from "@/types/Workout";
import { getExerciseETL } from "@/utils/etl";
import { estimateExerciseDuration } from "@/utils/volume/estimateExerciseDuration";
import {
  Clock,
  FileText,
  GripVertical,
  Plus,
  RotateCcw,
  Trash2,
  Weight,
  X,
} from "lucide-react";
import { useState } from "react";
import { ETLDisplay } from "../insights/EtlDisplay";

const intensityLabel: Record<IntensitySystem, string> = {
  rpe: "RPE",
  one_rep_max_percent: "%1RM",
  rir: "RIR",
  none: "Effort",
};

export const ExerciseBuilderCard = ({
  order,
  exercise,
  onRemove,
  onUpdateSets,
  onUpdateIntensity,
  onUpdateNotes,
}: {
  order: number;
  exercise: WorkoutExercise;
  onRemove: () => void;
  onUpdateSets: (sets: WorkoutExercise["sets"]) => void;
  onUpdateIntensity: (intensity: IntensitySystem) => void;
  onUpdateNotes: (notes: string) => void;
}) => {
  const [tempNotes, setTempNotes] = useState(exercise.notes || "");

  const exerciseMeta = fetchExerciseById(exercise.exercise_id).then(
    (meta) => meta as unknown as Exercise
  );

  const { totalETL } = getExerciseETL(
    exercise,
    exerciseMeta as unknown as Exercise
  );

  const addSet = () => {
    const newSet = {
      reps: 8,
      rest: 90,
      rpe: null,
      rir: null,
      one_rep_max_percent: null,
    };
    onUpdateSets([...exercise.sets, newSet]);
  };

  const removeSet = (index: number) => {
    onUpdateSets(exercise.sets.filter((_, i) => i !== index));
  };

  const updateSet = (
    index: number,
    field: keyof WorkoutExercise["sets"][0],
    value: number
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

  return (
    <Card className="group relative bg-background border border-border hover:border-border hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm font-bold">
              {order + 1}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-foreground text-lg">
                {exercise.name}
              </h3>

              <div className="flex items-center gap-2">
                {exercise.notes && (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded italic">
                      {exercise.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 transition-opacity">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 ${
                    exercise.notes ? "text-primary" : "text-muted-foreground"
                  } hover:text-primary`}
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Exercise Notes</h4>
                  <Textarea
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    placeholder="Add notes about form, tempo, modifications..."
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTempNotes(exercise.notes || "")}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        onUpdateNotes(tempNotes);
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="sm" className="p-2 cursor-move">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="p-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <Select
              value={exercise.intensity}
              onValueChange={(v) => {
                onUpdateIntensity(v as IntensitySystem);
              }}
            >
              <SelectTrigger className="h-8 w-28 text-sm">
                <SelectValue placeholder="Intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rpe">RPE</SelectItem>
                <SelectItem value="one_rep_max_percent">%1RM</SelectItem>
                <SelectItem value="rir">RIR</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Sets Table Header */}
        {exercise.sets.length > 0 && (
          <div className="grid grid-cols-[40px_1fr_1fr_1fr_60px] gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide px-2">
            <div>Set</div>
            <div className="flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              Reps
            </div>
            <div className="flex items-center gap-1">
              <Weight className="w-3 h-3" />
              {intensityLabel[exercise.intensity]}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Rest (s)
            </div>
            <div>Actions</div>
          </div>
        )}

        {/* Sets List */}
        <div className="space-y-2">
          {exercise.sets.map((set, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-2 items-center p-3  rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="col-span-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {i + 1}
                </span>
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={set.reps}
                  onChange={(e) =>
                    updateSet(i, "reps", Number.parseInt(e.target.value) || 0)
                  }
                  className="h-8 text-sm text-center"
                  placeholder="Reps"
                />
              </div>
              <div className="col-span-3">
                <div className="relative">
                  {exercise.intensity === "rpe" && (
                    <Input
                      type="number"
                      min={5}
                      max={10}
                      step={0.5}
                      value={set.rpe ?? ""}
                      onChange={(e) =>
                        updateSet(i, "rpe", Number.parseFloat(e.target.value))
                      }
                      placeholder="RPE"
                      className="h-8 text-sm text-center"
                    />
                  )}
                  {exercise.intensity === "one_rep_max_percent" && (
                    <Input
                      type="number"
                      min={50}
                      max={100}
                      step={1}
                      value={set.one_rep_max_percent ?? ""}
                      onChange={(e) =>
                        updateSet(
                          i,
                          "one_rep_max_percent",
                          Number.parseInt(e.target.value)
                        )
                      }
                      placeholder="%1RM"
                      className="h-8 text-sm text-center"
                    />
                  )}
                  {exercise.intensity === "rir" && (
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      step={1}
                      value={set.rir ?? ""}
                      onChange={(e) =>
                        updateSet(i, "rir", Number.parseInt(e.target.value))
                      }
                      placeholder="RIR"
                      className="h-8 text-sm text-center"
                    />
                  )}
                </div>
              </div>
              <div className="col-span-3">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    step="15"
                    value={set.rest ?? ""}
                    onChange={(e) =>
                      updateSet(i, "rest", Number.parseInt(e.target.value) || 0)
                    }
                    className="h-8 text-sm text-center pr-8"
                    placeholder="Rest"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    s
                  </span>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => duplicateSet(i)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                  title="Duplicate set"
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSet(i)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                  title="Remove set"
                  disabled={exercise.sets.length === 1}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Set Button */}
        <div className="flex flex-1 gap-2 pt-2 border-t border-border">
          <Button
            onClick={addSet}
            variant="outline"
            className="flex-1 h-10 border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-colors bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Set
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between bg-muted p-2 rounded-sm text-xs text-muted-foreground pt-2  ">
          <div className="flex items-center gap-4">
            <ETLDisplay etl={totalETL} />
            <span>
              Total Reps:{" "}
              <span className="font-medium text-muted-foreground">
                {exercise.sets.reduce((sum, set) => sum + set.reps, 0)}
              </span>
            </span>
          </div>
          <div>
            Est. Time:{" "}
            <span className="font-medium text-muted-foreground">
              {Math.ceil(estimateExerciseDuration(exercise) / 60)} min
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
