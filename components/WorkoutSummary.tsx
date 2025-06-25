"use client";

import { EnergySystemChart } from "@/components/EnergySystemChart";
import { FatigueBreakdown } from "@/components/FatigueBreakdown";
import { MuscleBreakdownChart } from "@/components/MuscleBreakdownChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { WorkoutExercise } from "@/types/Workout";
import { getExerciseDetails } from "@/utils/getExerciseDetails";
import { calculateWorkoutSummary } from "@/utils/workout-summary";
import { BarChart2 } from "lucide-react";

export const WorkoutSummary = ({ workout }: { workout: WorkoutExercise[] }) => {
  if (workout.length === 0) return null;

  const fullExercises = getExerciseDetails(workout);

  const summary = calculateWorkoutSummary(fullExercises);

  const {
    totalVolume,
    avgFatigue,
    avgCNS,
    avgMet,
    avgJoint,
    systemBreakdown,
    topMuscles,
    movementFocus,
    avgRecovery,
    maxRecovery,
  } = summary;

  const metrics = [
    {
      label: "Total Volume",
      value: `${Math.round(totalVolume)} kg·reps`,
      description: "Total volume of all exercises",
    },
    {
      label: "Avg Intensity",
      value: `${(avgFatigue * 10).toFixed(1)} / 10`,
      description: "Average fatigue level",
    },
    {
      label: "Recovery Time",
      value: `${avgRecovery.toFixed(1)} days`,
      description: "Average recovery time",
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BarChart2 className="w-4 h-4" /> View Workout Summary
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-3xl min-w-1/3 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-slate-900">
            Workout Analysis
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-8 mt-6">
          {/* Topline Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl  px-4 py-5 text-center flex flex-col gap-2"
              >
                <div className="text-xl font-semibold text-gray-900">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-500">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panels */}
          <Card className="border-none shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-800">
                Workout Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FatigueBreakdown
                avgCNS={avgCNS}
                avgMet={avgMet}
                avgJoint={avgJoint}
              />
              <EnergySystemChart
                systemBreakdown={systemBreakdown}
                totalExercises={workout.length}
              />
              <MuscleBreakdownChart muscles={topMuscles} />
              <div className="rounded-lg border bg-white px-4 py-3">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">
                  Movement Patterns
                </h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  {Object.entries(movementFocus).map(([cat, count]) => (
                    <li key={cat} className="flex justify-between">
                      <span className="capitalize">{cat}</span>
                      <span className="font-medium">{count}x</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <Card className="border bg-white rounded-xl">
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 text-center text-sm text-gray-700">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {workout.length}
                </div>
                <div>Total Exercises</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {topMuscles.length}
                </div>
                <div>Muscles Targeted</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {Object.keys(systemBreakdown).length}
                </div>
                <div>Energy Systems</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {Math.round(totalVolume / workout.length)}
                </div>
                <div>Avg Volume/Movement</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
