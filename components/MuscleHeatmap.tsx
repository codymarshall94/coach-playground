"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MuscleVolumeRow } from "@/features/workout-builder/components/insights/MuscleVolumeRow";
import type { Exercise } from "@/types/Exercise";
import type { WorkoutExercise, WorkoutExerciseGroup } from "@/types/Workout";
import { RotateCcw, User, UserCheck } from "lucide-react";
import { useState } from "react";
import Model, { type Muscle } from "react-body-highlighter";

const muscleNameMap: Record<string, Muscle> = {
  pectoralis_major: "chest",
  triceps_brachii: "triceps",
  biceps: "biceps",
  forearms: "forearm",
  anterior_deltoid: "front-deltoids",
  lateral_deltoid: "front-deltoids",
  posterior_deltoid: "back-deltoids",
  upper_traps: "trapezius",
  lower_traps: "trapezius",
  latissimus_dorsi: "upper-back",
  rhomboids: "upper-back",
  erector_spinae: "lower-back",
  gluteus_maximus: "gluteal",
  quadriceps: "quadriceps",
  hamstrings: "hamstring",
  calves: "calves",
  soleus: "calves",
  core: "abs",
  obliques: "obliques",
  adductor: "adductor",
  abductors: "abductors",
};

const backMuscles = [
  "back-deltoids",
  "trapezius",
  "erector_spinae",
  "gluteal",
  "hamstring",
  "quadriceps",
  "calves",
];
const frontMuscles = [
  "front-deltoids",
  "triceps",
  "biceps",
  "forearm",
  "abs",
  "obliques",
  "adductor",
  "abductors",
];

export default function MuscleHeatmap({
  workoutExercises,
  exercises,
  muscle_volumes,
  muscle_set_counts,
  maxVolume,
  workout,
}: {
  workoutExercises: WorkoutExercise[];
  exercises: Exercise[];
  muscle_volumes: Record<string, number>;
  muscle_set_counts: Record<string, number>;
  maxVolume: number;
  workout: WorkoutExerciseGroup[];
}) {
  const [viewType, setViewType] = useState<"anterior" | "posterior">(
    "anterior"
  );

  const colorWithIntensity = (sets: number) =>
    `rgba(59, 130, 246, ${Math.min(0.2 + sets * 0.15, 0.9)})`;

  const getMuscles = (exercise: WorkoutExercise): Muscle[] => {
    const rawMuscles =
      exercises.find((e) => e.id === exercise.exercise_id)?.activation_map ||
      {};
    return Object.keys(rawMuscles)
      .map((m) => muscleNameMap[m])
      .filter((v): v is Muscle => !!v);
  };

  const getBackMuscleCount = (exercises: WorkoutExercise[]): number => {
    const muscles = exercises.flatMap(getMuscles);
    return muscles.filter((m) => backMuscles.includes(m)).length;
  };

  const getFrontMuscleCount = (exercises: WorkoutExercise[]): number => {
    const muscles = exercises.flatMap(getMuscles);
    return muscles.filter((m) => frontMuscles.includes(m)).length;
  };

  const highlightData = workoutExercises.map((w) => ({
    name: w.name,
    muscles: getMuscles(w),
    color: colorWithIntensity(w.sets.length),
  }));

  const activatedMuscles = Array.from(
    new Set(highlightData.flatMap((data) => data.muscles))
  );

  // const totalSets = workoutExercises.reduce((sum, w) => sum + w.sets.length, 0);
  // const uniqueExercises = workoutExercises.length;

  return (
    <Card className="w-full  mx-auto">
      <CardHeader className="text-center flex flex-row justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-blue-500" />
          Muscle Activation
        </CardTitle>

        <div className="flex justify-center">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewType === "anterior" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("anterior")}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Front View ({getFrontMuscleCount(workoutExercises)})
            </Button>
            <Button
              variant={viewType === "posterior" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("posterior")}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Back View ({getBackMuscleCount(workoutExercises)})
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* View Toggle */}

        {/* Model Display */}
        <div className="flex justify-center">
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8 shadow-inner">
            <Model
              data={highlightData}
              style={{ width: "auto", height: 400, maxWidth: "100%" }}
              bodyColor="#e5e7eb"
              type={viewType}
            />
          </div>
        </div>

        {/* Intensity Legend */}
        <div className="space-y-3">
          <h3 className="font-semibold text-center">Intensity Scale</h3>
          <div className="flex justify-center items-center gap-2">
            <span className="text-xs text-muted-foreground">Low</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((intensity) => (
                <div
                  key={intensity}
                  className="w-6 h-4 rounded-sm border border-gray-300"
                  style={{
                    backgroundColor: colorWithIntensity(intensity),
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>

        {activatedMuscles.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-center">
              Targeted Muscle Groups
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {activatedMuscles.map((muscle) => (
                <Badge key={muscle} variant="secondary" className="capitalize">
                  {muscle.replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="grid gap-2  ">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Muscle Group Volumes
              </h4>
              {Object.entries(muscle_volumes).map(([muscle, volume], index) => (
                <MuscleVolumeRow
                  key={muscle}
                  index={index}
                  muscleId={muscle}
                  setCount={muscle_set_counts[muscle]}
                  weightedVolume={volume}
                  maxVolume={maxVolume}
                  workout={workout.flatMap((g) => g.exercises)}
                  exercises={exercises ?? []}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
