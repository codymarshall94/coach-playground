import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";
import { ActivationMap, Muscle } from "@/types/Exercise";

interface MuscleActivationChartProps {
  activationMap: ActivationMap;
}

export function MuscleActivationChart({
  activationMap,
}: MuscleActivationChartProps) {
  const sortedMuscles = Object.entries(activationMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="space-y-3">
      {sortedMuscles.map(([muscle, activation]) => {
        const percentage = activation * 100;
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
                {MUSCLE_DISPLAY_MAP[muscle as Muscle]}
              </span>
              <span className="text-gray-600 font-semibold">
                {percentage.toFixed(0)}%
              </span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${getBarColor(
                  percentage
                )}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
