import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Weight } from "lucide-react";

type Props = {
  normalizedETL: number;
  label?: string;
  className?: string;
};

function getETLCategory(normalizedETL: number) {
  if (normalizedETL < 100)
    return {
      label: "Recovery",
      color: "text-green-500",
      desc: "Very low stress. Good for rest days or active recovery.",
    };
  if (normalizedETL < 120)
    return {
      label: "Easy",
      color: "text-lime-500",
      desc: "Light training. Great for deloads or low-impact movement.",
    };
  if (normalizedETL < 150)
    return {
      label: "Challenging",
      color: "text-yellow-500",
      desc: "Moderate effort. Solid training session without overdoing it.",
    };
  if (normalizedETL < 180)
    return {
      label: "Hard",
      color: "text-orange-500",
      desc: "High effort. Pushes your limits but still manageable.",
    };
  if (normalizedETL < 180)
    return {
      label: "Heavy",
      color: "text-red-500",
      desc: "Very demanding. Be mindful of fatigue and recovery.",
    };
  return {
    label: "Max Load",
    color: "text-rose-600",
    desc: "Extreme training load. Used for peak efforts or testing.",
  };
}

export const ETLDisplay = ({
  normalizedETL,
  label = "ETL",
  className = "",
}: Props) => {
  const category = getETLCategory(normalizedETL);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1">
          <Weight className="w-4 h-4 text-muted-foreground" />
          <span
            className={`flex items-center gap-1 cursor-help ${className} text-muted-foreground`}
          >
            {label}:{" "}
            <span className={`font-bold ${category.color}`}>
              {category.label}
            </span>
          </span>
        </div>
      </TooltipTrigger>

      <TooltipContent className="max-w-[280px] text-xs bg-background text-foreground border border-border">
        <p className="font-medium mb-1">What is ETL?</p>
        <p className="mb-2">
          ETL (Estimated Training Load) is a rough measure of how much stress a
          workout puts on your body. It factors in reps, intensity, fatigue, and
          total volume.
        </p>
        <p className={`font-semibold ${category.color}`}>
          Category: {category.label}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{category.desc}</p>
        <p className="mt-2 text-xs text-gray-400">
          Raw ETL Score:{" "}
          <span className="font-mono">{normalizedETL.toFixed(1)}</span>
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
