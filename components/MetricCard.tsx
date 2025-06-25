"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "orange" | "red" | "purple";
  progress?: number;
  maxProgress?: number;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  progress,
  maxProgress = 10,
}: MetricCardProps) {
  const colorClasses = {
    blue: "border-l-blue-500 bg-blue-50/50",
    green: "border-l-green-500 bg-green-50/50",
    orange: "border-l-orange-500 bg-orange-50/50",
    red: "border-l-red-500 bg-red-50/50",
    purple: "border-l-purple-500 bg-purple-50/50",
  };

  const iconColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    red: "text-red-600",
    purple: "text-purple-600",
  };

  const progressColors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
  };

  return (
    <Card
      className={`border-l-4 ${colorClasses[color]} hover:shadow-md transition-shadow`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconColors[color]}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        {progress !== undefined && (
          <div className="space-y-1">
            <Progress value={(progress / maxProgress) * 100} className="h-2" />
            <div
              className={`absolute top-0 left-0 h-2 rounded-full transition-all ${progressColors[color]}`}
              style={{ width: `${(progress / maxProgress) * 100}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
