"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bone, Brain, Heart } from "lucide-react";

interface FatigueBreakdownProps {
  avgCNS: number;
  avgMet: number;
  avgJoint: number;
}

export function FatigueBreakdown({
  avgCNS,
  avgMet,
  avgJoint,
}: FatigueBreakdownProps) {
  const fatigueMetrics = [
    {
      label: "CNS Demand",
      value: avgCNS * 10,
      icon: Brain,
      color: "purple",
      description: "Nervous system stress",
    },
    {
      label: "Metabolic",
      value: avgMet * 10,
      icon: Heart,
      color: "red",
      description: "Energy system demand",
    },
    {
      label: "Joint Stress",
      value: avgJoint * 10,
      icon: Bone,
      color: "orange",
      description: "Mechanical stress",
    },
  ];

  const getIntensityColor = (value: number) => {
    if (value <= 3) return "text-green-600";
    if (value <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (value: number) => {
    if (value <= 3) return "bg-green-500";
    if (value <= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Fatigue Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fatigueMetrics.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    {metric.label}
                  </span>
                </div>
                <span
                  className={`font-bold ${getIntensityColor(metric.value)}`}
                >
                  {metric.value.toFixed(1)}/10
                </span>
              </div>
              <div className="relative">
                <Progress value={(metric.value / 10) * 100} className="h-2" />
                <div
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(
                    metric.value
                  )}`}
                  style={{ width: `${(metric.value / 10) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
