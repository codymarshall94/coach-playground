import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";

interface MuscleVolumeRowProps {
  index: number;
  muscleId: string;
  setCount: number;
  weightedVolume: number;
  maxVolume: number;
}

export const MuscleVolumeRow: React.FC<MuscleVolumeRowProps> = ({
  index,
  muscleId,
  setCount,
  weightedVolume,
  maxVolume,
}) => {
  const displayName =
    MUSCLE_DISPLAY_MAP[muscleId as keyof typeof MUSCLE_DISPLAY_MAP];
  const percent = (weightedVolume / maxVolume) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="capitalize text-slate-600">{displayName}</span>
        <div className="flex items-center gap-2">
          <Badge
            className={`${
              index + 1 > 3 ? "bg-slate-300" : "bg-slate-500"
            } text-white`}
          >
            {index + 1}
          </Badge>
          <span className="text-slate-500">{setCount} sets</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-slate-400 text-[10px] underline cursor-help">
                ({weightedVolume.toFixed(1)} weighted)
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-[220px] text-xs">
              Based on how much the muscle is activated in each exercise. A
              lower activation means it contributes less than 1 full set.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="w-full bg-slate-100 rounded h-1 overflow-hidden">
        <div
          className="bg-slate-500 h-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
