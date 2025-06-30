"use client";
import { Progress } from "@/components/ui/progress";
import { FIELD_INFO } from "@/constants/exercise-info";
import { InfoTooltip } from "./InfoTooltip";

interface ProgressIndicatorProps {
  value: number;
  max?: number;
  label: string;
  showValue?: boolean;
  field: keyof typeof FIELD_INFO;
}

export function ProgressIndicator({
  value,
  max = 10,
  label,
  showValue = true,
  field,
}: ProgressIndicatorProps) {
  const percentage = (value / max) * 100;

  const getIntensityColor = (val: number) => {
    if (val <= 3) return "green";
    if (val <= 6) return "yellow";
    return "red";
  };

  const intensityColor = getIntensityColor(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {label} <InfoTooltip field={field} />
        </span>
        {showValue && (
          <span
            className={`text-sm font-semibold ${
              intensityColor === "green"
                ? "text-green-600"
                : intensityColor === "yellow"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {value.toFixed(1)}/{max}
          </span>
        )}
      </div>
      <div className="relative">
        <Progress value={percentage} className="h-2" />
        <div
          className={`absolute top-0 left-0 h-2 rounded-full transition-all ${
            intensityColor === "green"
              ? "bg-green-500"
              : intensityColor === "yellow"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
