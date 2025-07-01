"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Heart, Zap } from "lucide-react";

interface EnergySystemChartProps {
  systemBreakdown: Record<string, number>;
  totalExercises: number;
}

export function EnergySystemChart({
  systemBreakdown,
  totalExercises,
}: EnergySystemChartProps) {
  const getSystemIcon = (system: string) => {
    switch (system.toLowerCase()) {
      case "aerobic":
        return <Heart className="w-4 h-4 text-blue-500" />;
      case "anaerobic":
        return <Zap className="w-4 h-4 text-destructive" />;
      default:
        return <Flame className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSystemBar = (system: string) => {
    switch (system.toLowerCase()) {
      case "aerobic":
        return "bg-blue-500";
      case "anaerobic":
        return "bg-destructive";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-600" />
          Energy System Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(systemBreakdown).map(([system, count]) => {
          const percent = (count / totalExercises) * 100;

          return (
            <div key={system} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {getSystemIcon(system)}
                  <span className="capitalize font-medium">{system}</span>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  {count}x ({percent.toFixed(0)}%)
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getSystemBar(
                    system
                  )}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
