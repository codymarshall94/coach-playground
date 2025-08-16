"use client";

import { InfoTooltip } from "@/components/InfoTooltip";
import MuscleHeatmap from "@/components/MuscleHeatmap";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldInfo } from "@/constants/exercise-info";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/types/Exercise";
import { BarChart3, Brain, Clock, Eye, Flame } from "lucide-react";
import Image from "next/image";

export function ExerciseDetailModal({
  exercise,
  triggerClassName,
}: {
  exercise: Exercise;
  triggerClassName?: string;
}) {
  const fatigueDemands = [
    {
      name: "CNS Demand",
      icon: <Brain className="w-4 h-4 text-gray-500" />,
      field: "cnsDemand",
      value: (exercise.cns_demand * 10).toFixed(1),
    },

    {
      name: "Metabolic Demand",
      icon: <Flame className="w-4 h-4 text-gray-500" />,
      field: "metabolicDemand",
      value: (exercise.metabolic_demand * 10).toFixed(1),
    },

    {
      name: "Joint Stress",
      icon: <BarChart3 className="w-4 h-4 text-gray-500" />,
      field: "jointStress",
      value: (exercise.joint_stress * 10).toFixed(1),
    },
  ];

  const exerciseMetrics = [
    {
      name: "Recovery Time",
      icon: <Clock className="w-4 h-4 text-gray-500" />,
      field: "recoveryDays",
      value: exercise.recovery_days,
    },
    {
      name: "Calorie Burn",
      icon: <Flame className="w-4 h-4 text-gray-500" />,
      field: "baseCalorieCost",
      value: exercise.base_calorie_cost,
    },
    {
      name: "Energy System",
      icon: <Flame className="w-4 h-4 text-gray-500" />,
      field: "energySystem",
      value: exercise.energy_system,
    },
  ];

  const movementProfile = [
    {
      name: "Load Profile",
      icon: <BarChart3 className="w-4 h-4 text-gray-500" />,
      field: "loadProfile",
      value: exercise.load_profile,
    },
    {
      name: "Force Curve",
      icon: <BarChart3 className="w-4 h-4 text-gray-500" />,
      field: "forceCurve",
      value: exercise.force_curve,
    },
    {
      name: "ROM Rating",
      icon: <BarChart3 className="w-4 h-4 text-gray-500" />,
      field: "romRating",
      value: exercise.rom_rating,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "hover:bg-green-50 rounded p-1 hover:border-green-200 bg-transparent",
            triggerClassName
          )}
        >
          <Eye className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:min-w-[30vw] max-w-[300px]   max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-start gap-2">
            {exercise.image_url && (
              <Image
                src={exercise.image_url}
                alt={exercise.name}
                width={100}
                height={100}
                className="rounded-md"
              />
            )}
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {exercise.name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <MuscleHeatmap
          mode="library"
          exerciseMetas={[exercise]}
          intensityFrom="avg"
          constantIntensity={0}
        />
        <div className="grid grid-cols-1 gap-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Fatigue Demands
          </h3>
          <div className="grid grid-cols-1  gap-6">
            {fatigueDemands.map((demand) => (
              <div
                key={demand.name}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className={cn("w-4 h-4")}>{demand.icon}</div>
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    {demand.name}{" "}
                    <InfoTooltip field={demand.field as FieldInfo} />
                  </span>
                </div>

                <span
                  className={cn(
                    "text-sm font-semibold text-gray-900 bg-load-low rounded-full px-3 py-2",
                    Number(demand.value) > 3 && "bg-load-medium/50",
                    Number(demand.value) > 5 && "bg-load-high/50",
                    Number(demand.value) > 7 && "bg-load-max/50 text-white"
                  )}
                >
                  {demand.value}
                </span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            Exercise Metrics
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {exerciseMetrics.map((metric) => (
              <div
                key={metric.name}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4">{metric.icon}</div>
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    {metric.name}{" "}
                    <InfoTooltip field={metric.field as FieldInfo} />
                  </span>
                </div>
                <span className="text-sm px-3 py-2 font-semibold text-muted-foreground">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Movement Profile
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {movementProfile.map((profile) => (
              <div
                key={profile.name}
                className="flex justify-between items-center p-2 bg-muted/50 rounded"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 text-muted-foreground">
                    {profile.icon}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    {profile.name}{" "}
                    <InfoTooltip field={profile.field as FieldInfo} />
                  </span>
                </div>
                <span className="text-sm px-3 py-2 font-semibold text-muted-foreground">
                  {profile.value.charAt(0).toUpperCase() +
                    profile.value.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
