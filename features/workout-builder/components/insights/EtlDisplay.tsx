import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Weight } from "lucide-react";

type Props = {
  normalizedETL: number;
  label?: string;
  className?: string;
};

function getETLCategory(normalizedETL: number) {
  if (normalizedETL < 1.5)
    return {
      label: "Recovery",
      textColor: "text-foreground",
      bgColor: "bg-load-low/30",
      desc: "Very low stress. Good for warmups, deloads, or active recovery.",
      rangeIndex: 0,
    };
  if (normalizedETL < 3)
    return {
      label: "Light",
      textColor: "text-foreground",
      bgColor: "bg-load-low/30",
      desc: "Low effort. Suitable for easy accessories or deload sessions.",
      rangeIndex: 1,
    };
  if (normalizedETL < 4.5)
    return {
      label: "Moderate",
      textColor: "text-foreground",
      bgColor: "bg-load-medium/30",
      desc: "Solid work. Typical for accessories or moderate compound lifts.",
      rangeIndex: 2,
    };
  if (normalizedETL < 6)
    return {
      label: "Challenging",
      textColor: "text-foreground",
      bgColor: "bg-load-max/30",
      desc: "Pushing hard. High effort compound work or heavy isolation.",
      rangeIndex: 3,
    };
  if (normalizedETL < 8)
    return {
      label: "Hard",
      textColor: "text-foreground",
      bgColor: "bg-load-max/30",
      desc: "Very demanding. Heavy compounds near failure. Manage recovery.",
      rangeIndex: 4,
    };
  return {
    label: "Max Effort",
    textColor: "text-foreground",
    bgColor: "bg-destructive/50",
    desc: "Extreme training load. Peak efforts or testing. Use sparingly.",
    rangeIndex: 5,
  };
}

const ETL_RANGES = [
  { label: "Recovery", range: "0 – 1.5" },
  { label: "Light", range: "1.5 – 3" },
  { label: "Moderate", range: "3 – 4.5" },
  { label: "Challenging", range: "4.5 – 6" },
  { label: "Hard", range: "6 – 8" },
  { label: "Max Effort", range: "8 – 10" },
];

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
          <Weight className="w-3 h-3 text-muted-foreground" />
          <span
            className={`flex items-center gap-1 cursor-help ${className} text-muted-foreground`}
          >
            {label}:{" "}
            <Badge
              className={cn(
                `font-medium text-[10px] px-1.5 py-0 ${category.textColor}`,
                category.bgColor
              )}
            >
              {category.label}
            </Badge>
          </span>
        </div>
      </TooltipTrigger>

      <TooltipContent className="max-w-[280px] text-xs bg-background text-foreground border border-border">
        <p className="font-medium mb-1">What is ETL?</p>
        <p className="mb-2">
          ETL (Estimated Training Load) measures how much stress an exercise or
          workout puts on your body. It factors in reps, intensity (RPE), set
          types, and exercise difficulty.
        </p>
        <div className="h-1 rounded-full overflow-hidden bg-muted">
          <div
            className={category.bgColor}
            style={{ width: `${Math.min((normalizedETL / 10) * 100, 100)}%` }}
          />
        </div>

        <p className="mt-1 text-xs text-muted-foreground">{category.desc}</p>
        <p className="mt-2 text-xs text-gray-400">
          ETL Score:{" "}
          <span className="font-mono">{normalizedETL.toFixed(1)}</span>
          <span className="text-gray-500"> / 10</span>
        </p>

        {/* Difficulty scale */}
        <div className="mt-2 pt-2 border-t border-border space-y-0.5">
          {ETL_RANGES.map((tier, i) => (
            <div
              key={tier.label}
              className={cn(
                "flex items-center justify-between px-1.5 py-0.5 rounded text-[11px]",
                i === category.rangeIndex
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <span className="flex items-center gap-1">
                {i === category.rangeIndex && (
                  <span className="w-1 h-1 rounded-full bg-foreground inline-block" />
                )}
                {tier.label}
              </span>
              <span className="font-mono text-[10px]">{tier.range}</span>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
