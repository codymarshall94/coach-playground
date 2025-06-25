"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface MuscleBreakdownChartProps {
  muscles: Array<[string, number]>;
}

export function MuscleBreakdownChart({ muscles }: MuscleBreakdownChartProps) {
  const maxActivation = Math.max(...muscles.map(([, val]) => val));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-red-600" />
          Muscle Activation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {muscles.map(([muscle, activation]) => {
            const percentage = (activation / maxActivation) * 100;
            const displayPercentage = (activation * 100).toFixed(0);

            const getBarColor = (val: number) => {
              if (val >= 80) return "bg-red-500";
              if (val >= 60) return "bg-orange-500";
              if (val >= 40) return "bg-yellow-500";
              return "bg-green-500";
            };

            return (
              <div key={muscle} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 capitalize">
                    {muscle.replace(/_/g, " ")}
                  </span>
                  <span className="text-gray-600 font-semibold">
                    {displayPercentage}%
                  </span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getBarColor(
                      Number(displayPercentage)
                    )}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
