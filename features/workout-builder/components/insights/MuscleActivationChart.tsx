import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";
import { ExerciseMuscleJoined } from "@/types/Exercise";

interface MuscleActivationChartProps {
  activationMap: ExerciseMuscleJoined[];
}

export function MuscleActivationChart({
  activationMap,
}: MuscleActivationChartProps) {
  const sortedMuscles = activationMap
    .sort((a, b) => (b.contribution ?? 0) - (a.contribution ?? 0))
    .slice(0, 8);

  return (
    <div className="space-y-3">
      {sortedMuscles.map((muscle) => {
        const percentage = (muscle.contribution ?? 0) * 100;
        const getBarColor = (val: number) => {
          if (val >= 80) return "bg-red-500";
          if (val >= 60) return "bg-orange-500";
          if (val >= 40) return "bg-yellow-500";
          return "bg-green-500";
        };

        return (
          <div key={muscle.muscles.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 capitalize">
                {MUSCLE_DISPLAY_MAP[muscle.muscles.id]}
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
