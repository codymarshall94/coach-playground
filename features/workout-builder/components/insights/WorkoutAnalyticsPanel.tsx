"use client";

import { EmptyState } from "@/components/EmptyState";
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
import { WorkoutExerciseGroup } from "@/types/Workout";
import { WorkoutSummaryStats } from "@/types/WorkoutSummary";
import { BarChart2, Dumbbell } from "lucide-react";

import MuscleHeatmap from "@/components/MuscleHeatmap";
import { getAllExercises } from "@/services/exerciseService";
import { Exercise } from "@/types/Exercise";
import { useQuery } from "@tanstack/react-query";
import { EnergySystemChart } from "./EnergySystemChart";
import { FatigueBreakdown } from "./FatigueBreakdown";
import { RatioIndicator } from "./RatioIndicator";

interface Props {
  workout: WorkoutExerciseGroup[];
  summary: WorkoutSummaryStats;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const WorkoutAnalyticsPanel = ({
  workout,
  summary,
  open,
  setOpen,
}: Props) => {
  const { data: exercises } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => getAllExercises() as Promise<Exercise[]>,
  });

  if (workout.flatMap((g) => g.exercises).length === 0) {
    return (
      <EmptyState
        icon={<Dumbbell />}
        title="No exercises added"
        description="Add exercises to see analysis"
      />
    );
  }

  const {
    total_sets,
    total_fatigue,
    injury_risk,
    avgRecovery,
    push_pull_ratio,
    lower_upper_ratio,
    workout_type,
    top_muscles,
    muscle_volumes,
    muscle_set_counts,
    systemBreakdown,
    movementFocus,
    avgCNS,
    avgMet,
    avgJoint,
  } = summary;

  const maxVolume = top_muscles[0]?.[1] || 1;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4" />
          Day Summary
        </Button>
      </SheetTrigger>

      <SheetContent className="space-y-6 overflow-y-auto w-full max-w-3xl min-w-1/2 lg:min-w-1/4 p-6">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-foreground">
            Day Summary
          </SheetTitle>
        </SheetHeader>

        {/* Fatigue */}
        <FatigueBreakdown avgCNS={avgCNS} avgMet={avgMet} avgJoint={avgJoint} />

        {/* Energy Systems */}
        <EnergySystemChart
          systemBreakdown={systemBreakdown}
          totalExercises={workout.length}
        />

        <MuscleHeatmap
          workoutExercises={workout.flatMap((g) => g.exercises)}
          exercises={exercises ?? []}
          muscle_volumes={muscle_volumes}
          muscle_set_counts={muscle_set_counts}
          maxVolume={maxVolume}
          workout={workout}
        />

        {/* Ratios */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                Push / Pull Ratio
              </h4>
              <RatioIndicator
                value={push_pull_ratio ?? 1}
                labelLeft="Pull"
                labelRight="Push"
                normalized
              />
            </div>

            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                Upper / Lower Ratio
              </h4>
              <RatioIndicator
                value={lower_upper_ratio ?? 1}
                labelLeft="Lower"
                labelRight="Upper"
                normalized
              />
            </div>
          </CardContent>
        </Card>

        {/* Risk + Meta */}
        <Card>
          <CardContent className="p-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <div className="font-medium">Workout Type</div>
              <div>{workout_type}</div>
            </div>
            <div>
              <div className="font-medium">Injury Risk</div>
              <div
                className={`inline-block px-2 py-1 rounded-md text-white text-xs ${
                  injury_risk === "High"
                    ? "bg-destructive"
                    : injury_risk === "Moderate"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              >
                {injury_risk}
              </div>
            </div>
            <div>
              <div className="font-medium">Avg Recovery Time</div>
              <div>{avgRecovery.toFixed(2)} days</div>
            </div>
            <div>
              <div className="font-medium">Fatigue Score</div>
              <div>{total_fatigue.toFixed(1)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Movement Patterns */}
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">
              Movement Patterns
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
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
          </CardContent>
        </Card>

        {/* Muscle Volumes */}

        {/* Summary */}
        <Card className="bg-background rounded-xl">
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 p-5 text-center text-sm text-muted-foreground">
            <div>
              <div className="text-lg font-bold text-foreground">
                {workout.flatMap((g) => g.exercises).length}
              </div>
              <div>Total Exercises</div>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">
                {top_muscles.length}
              </div>
              <div>Muscles Targeted</div>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">
                {Object.keys(systemBreakdown).length}
              </div>
              <div>Energy Systems</div>
            </div>
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  );
};
