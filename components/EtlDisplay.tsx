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
  formula?: {
    reps: number;
    intensity: number;
    fatigue: number;
    baseVolume: number;
  };
};

export const ETLDisplay = ({
  etl,
  label = "ETL",
  className = "",
  formula,
}: Props) => {
  const showFormula = !!formula;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`flex items-center gap-1 cursor-help ${className}`}>
          {label}:{" "}
          <span className="font-medium text-gray-700">{etl.toFixed(1)}</span>
          <Info className="w-4 h-4 text-slate-400" />
        </span>
      </TooltipTrigger>

      <TooltipContent className="max-w-[260px] text-xs">
        <p className="font-medium mb-1">What is ETL?</p>
        <p>
          ETL (Estimated Training Load) represents training stress by combining:
          reps × intensity × fatigue × volume estimate
        </p>
        {showFormula && (
          <>
            <div className="mt-2 text-gray-500">
              <div>
                <span className="font-semibold">Formula:</span>
              </div>
              <div>
                {formula.reps} reps × {formula.intensity.toFixed(2)} intensity ×{" "}
                {formula.fatigue.toFixed(2)} fatigue × {formula.baseVolume}{" "}
                volume
              </div>
              <div className="mt-1">
                = <span className="font-semibold">{etl.toFixed(1)} ETL</span>
              </div>
            </div>
          </>
        )}
      </TooltipContent>
    </Tooltip>
  );
};
