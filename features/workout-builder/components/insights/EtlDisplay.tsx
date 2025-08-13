import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Weight } from "lucide-react";

type Props = {
  normalizedETL: number;
  label?: string;
  className?: string;
};

function getETLCategory(normalizedETL: number) {
  if (normalizedETL < 100)
    return {
      label: "Recovery",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-500",
      desc: "Very low stress. Good for rest days or active recovery.",
    };
  if (normalizedETL < 125)
    return {
      label: "Easy",
      textColor: "text-primary",
      bgColor: "bg-primary",
      desc: "Light training. Great for deloads or low-impact movement.",
    };
  if (normalizedETL < 135)
    return {
      label: "Challenging",
      textColor: "text-indigo-700",
      bgColor: "bg-indigo-700",
      desc: "Moderate effort. Solid training session without overdoing it.",
    };
  if (normalizedETL < 145)
    return {
      label: "Hard",
      textColor: "text-orange-700",
      bgColor: "bg-orange-500",
      desc: "High effort. Pushes your limits but still manageable.",
    };
  if (normalizedETL < 155)
    return {
      label: "Heavy",
      textColor: "text-red-700",
      bgColor: "bg-red-500",
      desc: "Very demanding. Be mindful of fatigue and recovery.",
    };
  return {
    label: "Max Load",
    textColor: "text-rose-700",
    bgColor: "bg-rose-600",
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
            <span className={`font-bold ${category.textColor}`}>
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
        <div className="h-1 rounded-full overflow-hidden bg-muted">
          <div
            className={category.bgColor}
            style={{ width: `${Math.min((normalizedETL / 200) * 100, 100)}%` }}
          />
        </div>

        <p className="mt-1 text-xs text-muted-foreground">{category.desc}</p>
        <p className="mt-2 text-xs text-gray-400">
          Raw ETL Score:{" "}
          <span className="font-mono">{normalizedETL.toFixed(1)}</span>
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
