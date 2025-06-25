"use client";
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  value: number;
  max?: number;
  label: string;
  color?: "default" | "green" | "yellow" | "red";
  showValue?: boolean;
}

export function ProgressIndicator({
  value,
  max = 10,
  label,
  color = "default",
  showValue = true,
}: ProgressIndicatorProps) {
  const percentage = (value / max) * 100;

  const getColorClass = () => {
    switch (color) {
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      case "red":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getIntensityColor = (val: number) => {
    if (val <= 3) return "green";
    if (val <= 6) return "yellow";
    return "red";
  };

  const intensityColor = getIntensityColor(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
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
