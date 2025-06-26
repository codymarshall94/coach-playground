"use client";

import { EnergySystemChart } from "@/components/EnergySystemChart";
import { FatigueBreakdown } from "@/components/FatigueBreakdown";
import { MuscleBreakdownChart } from "@/components/MuscleBreakdownChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CATEGORY_DISPLAY_MAP } from "@/constants/movement-category";
import { WorkoutExercise } from "@/types/Workout";
import { WorkoutSummaryStats } from "@/types/WorkoutSummary";
import { BarChart2 } from "lucide-react";

export const WorkoutSummary = ({
  workout,
  summary,
}: {
  workout: WorkoutExercise[];
  summary: WorkoutSummaryStats;
}) => {
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
  } = summary;

  if (workout.length === 0) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BarChart2 className="w-4 h-4" /> Workout Summary
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-3xl min-w-1/3 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-slate-900">
            Workout Summary
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-8">
          {/* Detail Panels */}
          <Card className="border-none shadow-none">
            <CardContent className="grid grid-cols-1  gap-4">
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
                      <span className="capitalize">
                        {
                          CATEGORY_DISPLAY_MAP[
                            cat as keyof typeof CATEGORY_DISPLAY_MAP
                          ]
                        }
                      </span>
                      <span className="font-medium">{count}x</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <Card className="border bg-white rounded-xl">
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 p-5 text-center text-sm text-gray-700">
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
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
