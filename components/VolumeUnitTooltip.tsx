import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export const VolumeUnitTooltip = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Info className="w-4 h-4 text-slate-400 cursor-help" />
    </TooltipTrigger>
    <TooltipContent className="max-w-[260px] text-xs">
      <p className="font-medium">What are Volume Units?</p>
      <p className="mt-1 text-slate-500">
        Volume Units represent the amount of training work done — combining
        sets, reps, intensity, and the difficulty of the exercise.
        <br />
        <br />
        They help compare how much effort each exercise or workout demands, even
        if weights aren&apos;t tracked directly.
      </p>
    </TooltipContent>
  </Tooltip>
);
