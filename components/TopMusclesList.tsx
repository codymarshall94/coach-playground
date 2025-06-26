import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";

interface TopMusclesListProps {
  topMuscles: [string, number][];
}

export const TopMusclesList: React.FC<TopMusclesListProps> = ({
  topMuscles,
}) => {
  const maxVolume = topMuscles[0]?.[1] || 1;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-semibold text-slate-700">
          Top Targeted Muscles
        </h4>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs text-slate-400 cursor-help">🧠</span>
          </TooltipTrigger>
          <TooltipContent className="max-w-[220px] text-xs">
            Ranked by total activation volume across all exercises in the
            workout.
          </TooltipContent>
        </Tooltip>
      </div>

      <ul className="space-y-1">
        {topMuscles.map(([muscleId, volume], index) => {
          const displayName =
            MUSCLE_DISPLAY_MAP[muscleId as keyof typeof MUSCLE_DISPLAY_MAP];
          const percent = (volume / maxVolume) * 100;

          return (
            <li
              key={muscleId}
              className="flex items-center justify-between text-sm text-slate-600"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-white bg-slate-500 rounded px-2 py-0.5">
                  {index + 1}
                </span>
                <span>{displayName}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
