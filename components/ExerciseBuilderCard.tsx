"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { WorkoutExercise } from "@/types/Workout";
import { estimateExerciseDuration } from "@/utils/estimateExerciseDuration";
import {
  Clock,
  GripVertical,
  Plus,
  RotateCcw,
  Trash2,
  Weight,
  X,
} from "lucide-react";

export const ExerciseBuilderCard = ({
  order,
  exercise,
  onRemove,
  onUpdateSets,
}: {
  order: number;
  exercise: WorkoutExercise;
  onRemove: () => void;
  onUpdateSets: (sets: WorkoutExercise["sets"]) => void;
}) => {
  const addSet = () => {
    const newSet = { reps: 8, weight: 0, rest: 90 };
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
    <Card className="group relative bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              {order + 1}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {exercise.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="p-2 cursor-move">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Sets Table Header */}
        {exercise.sets.length > 0 && (
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide px-2">
            <div className="col-span-1">Set</div>
            <div className="col-span-3 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              Reps
            </div>
            <div className="col-span-3 flex items-center gap-1">
              <Weight className="w-3 h-3" />
              Weight
            </div>
            <div className="col-span-3 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Rest
            </div>
            <div className="col-span-2">Actions</div>
          </div>
        )}

        {/* Sets List */}
        <div className="space-y-2">
          {exercise.sets.map((set, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="col-span-1">
                <span className="text-sm font-medium text-gray-600">
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
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={set.weight}
                    onChange={(e) =>
                      updateSet(
                        i,
                        "weight",
                        Number.parseFloat(e.target.value) || 0
                      )
                    }
                    className="h-8 text-sm text-center pr-8"
                    placeholder="Weight"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    kg
                  </span>
                </div>
              </div>

              <div className="col-span-3">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    step="15"
                    value={set.rest}
                    onChange={(e) =>
                      updateSet(i, "rest", Number.parseInt(e.target.value) || 0)
                    }
                    className="h-8 text-sm text-center pr-8"
                    placeholder="Rest"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    s
                  </span>
                </div>
              </div>

              <div className="col-span-2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => duplicateSet(i)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                  title="Duplicate set"
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSet(i)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
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
        <div className="pt-2 border-t border-gray-200">
          <Button
            onClick={addSet}
            variant="outline"
            className="w-full h-10 border-dashed border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Set
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <span>
              Total Volume:{" "}
              <span className="font-medium text-gray-700">
                {exercise.sets
                  .reduce((sum, set) => sum + set.reps * set.weight, 0)
                  .toFixed(1)}{" "}
                kg
              </span>
            </span>
            <span>
              Total Reps:{" "}
              <span className="font-medium text-gray-700">
                {exercise.sets.reduce((sum, set) => sum + set.reps, 0)}
              </span>
            </span>
          </div>
          <div>
            Est. Time:{" "}
            <span className="font-medium text-gray-700">
              {Math.ceil(estimateExerciseDuration(exercise) / 60)} min
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
