"use client";

import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  ArrowDown,
  BarChart2,
  Clock,
  Dumbbell,
  Flame,
  LayoutGrid,
  ShieldAlert,
} from "lucide-react";

import MuscleHeatmap from "@/components/MuscleHeatmap";
import { getAllExercises } from "@/services/exerciseService";
import { Exercise } from "@/types/Exercise";
import { useQuery } from "@tanstack/react-query";
import { EnergySystemChart } from "./EnergySystemChart";
import { FatigueBreakdown } from "./FatigueBreakdown";
import { RatioIndicator } from "./RatioIndicator";

import { ArrowLeftRight, ArrowUpDown } from "lucide-react";

export const MOVEMENT_ICONS = {
  push_vertical: <ArrowUpDown className="w-4 h-4" />,
  push_horizontal: <ArrowLeftRight className="w-4 h-4" />,
  pull_horizontal: <ArrowLeftRight className="w-4 h-4 rotate-180" />,
  squat: <ArrowDown className="w-4 h-4" />,
};

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

      <SheetContent className="space-y-6 overflow-y-auto w-full  sm:min-w-1/3 md:min-w-1/2 lg:min-w-1/2 xl:min-w-1/3 p-6">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-foreground">
            Day Summary
          </SheetTitle>
        </SheetHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-primary" />
              Session Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-y-4 text-sm text-muted-foreground">
            <div>
              <div className="font-medium flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                Workout Type
              </div>
              <div className="text-foreground capitalize">{workout_type}</div>
            </div>
            <div>
              <div className="font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Injury Risk
              </div>
              <div
                className={`inline-block px-2 py-1 rounded-md text-white text-xs ${
                  injury_risk === "High"
                    ? "bg-load-high"
                    : injury_risk === "Moderate"
                    ? "bg-load-medium"
                    : "bg-load-low"
                }`}
              >
                {injury_risk}
              </div>
            </div>
            <div>
              <div className="font-medium flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Fatigue Score
              </div>
              <div className="text-foreground">{total_fatigue.toFixed(1)}</div>
            </div>
            <div>
              <div className="font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Avg Recovery Time
              </div>
              <div className="text-foreground">
                {avgRecovery.toFixed(2)} days
              </div>
            </div>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader>
            <CardTitle>Movement Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {Object.entries(movementFocus).map(([cat, count]) => {
                const label =
                  CATEGORY_DISPLAY_MAP[
                    cat as keyof typeof CATEGORY_DISPLAY_MAP
                  ];
                const icon = MOVEMENT_ICONS[cat as keyof typeof MOVEMENT_ICONS]; // define this map

                return (
                  <li key={cat} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        {icon}
                      </div>
                      <span className="capitalize text-sm font-medium text-foreground">
                        {label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {count}x
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  );
};
