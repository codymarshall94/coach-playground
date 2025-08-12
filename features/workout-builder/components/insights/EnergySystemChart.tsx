"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EnergySystem } from "@/types/Exercise";
import { Flame, Heart, Zap } from "lucide-react";

interface EnergySystemChartProps {
  systemBreakdown: Record<EnergySystem, number>;
  totalExercises: number;
}

export function EnergySystemChart({
  systemBreakdown,
  totalExercises,
}: EnergySystemChartProps) {
  const getSystemIcon = (system: EnergySystem) => {
    switch (system.toLowerCase()) {
      case "atp-cp":
        return <Heart className="w-4 h-4 text-load-low" />;
      case "glycolytic":
        return <Zap className="w-4 h-4 text-load-medium" />;
      case "oxidative":
        return <Flame className="w-4 h-4 text-load-high" />;
      default:
        return <Flame className="w-4 h-4 text-load-high" />;
    }
  };

  const getSystemBar = (system: EnergySystem) => {
    switch (system.toLowerCase()) {
      case "atp-cp":
        return "bg-load-low";
      case "glycolytic":
        return "bg-load-medium";
      case "oxidative":
        return "bg-load-high";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <Card className="space-y-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600" />
            <span className="text-lg font-semibold">Energy System Focus</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-3 rounded-full overflow-hidden flex bg-muted">
          {Object.entries(systemBreakdown).map(([system, count]) => {
            const percent = (count / totalExercises) * 100;
            return (
              <div
                key={system}
                className={`${getSystemBar(system as EnergySystem)} h-full`}
                style={{ width: `${percent}%` }}
              />
            );
          })}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm pt-1">
          {Object.entries(systemBreakdown).map(([system, count]) => {
            const percent = (count / totalExercises) * 100;
            return (
              <div
                key={system}
                className="flex items-center gap-2 text-muted-foreground"
              >
                {getSystemIcon(system as EnergySystem)}
                <span className="capitalize font-medium">{system}</span>
                <span className="text-xs">
                  ({count}x, {percent.toFixed(0)}%)
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
