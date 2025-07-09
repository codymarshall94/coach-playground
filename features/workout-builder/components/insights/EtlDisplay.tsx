import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

type Props = {
  etl: number;
  label?: string;
  className?: string;
};

function getETLCategory(etl: number) {
  if (etl < 500) return { label: "Recovery", color: "text-green-500" };
  if (etl < 1200) return { label: "Easy", color: "text-lime-500" };
  if (etl < 2000) return { label: "Challenging", color: "text-yellow-500" };
  if (etl < 3500) return { label: "Hard", color: "text-orange-500" };
  if (etl < 5000) return { label: "Heavy", color: "text-red-500" };
  return { label: "Max Load", color: "text-rose-600" };
}

export const ETLDisplay = ({ etl, label = "ETL", className = "" }: Props) => {
  const category = getETLCategory(etl);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`flex items-center gap-1 cursor-help ${className} text-muted-foreground`}
        >
          {label}:{" "}
          <span className={`font-bold ${category.color}`}>
            {etl.toFixed(1)}
          </span>
          <span className="text-xs font-medium text-gray-400">
            ({category.label})
          </span>
          <Info className="w-4 h-4 text-slate-400" />
        </span>
      </TooltipTrigger>

      <TooltipContent className="max-w-[260px] text-xs bg-background text-foreground border border-border">
        <p className="font-medium mb-1">What is ETL?</p>
        <p>
          ETL (Estimated Training Load) represents training stress by combining:
          reps × intensity × fatigue × volume estimate
        </p>

        <p className={`mt-2 text-xs font-semibold ${category.color}`}>
          Category: {category.label}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
