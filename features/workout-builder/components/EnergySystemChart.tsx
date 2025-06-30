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
        return <Heart className="w-4 h-4 text-blue-600" />;
      case "anaerobic":
        return <Zap className="w-4 h-4 text-red-600" />;
      default:
        return <Flame className="w-4 h-4 text-orange-600" />;
    }
  };

  const getSystemBar = (system: string) => {
    switch (system.toLowerCase()) {
      case "aerobic":
        return "bg-blue-500";
      case "anaerobic":
        return "bg-red-500";
      default:
        return "bg-orange-500";
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
                <div className="flex items-center gap-2 text-gray-700">
                  {getSystemIcon(system)}
                  <span className="capitalize font-medium">{system}</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  {count}x ({percent.toFixed(0)}%)
                </span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
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
