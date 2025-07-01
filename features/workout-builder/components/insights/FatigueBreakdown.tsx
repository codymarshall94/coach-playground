import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const metrics = [
    {
      label: "CNS Demand",
      value: avgCNS * 10,
      icon: Brain,
      color: "purple",
      description: "Neural fatigue from heavy loads or complex lifts.",
    },
    {
      label: "Metabolic",
      value: avgMet * 10,
      icon: Heart,
      color: "red",
      description: "Energy system stress from higher rep or explosive work.",
    },
    {
      label: "Joint Stress",
      value: avgJoint * 10,
      icon: Bone,
      color: "orange",
      description: "Structural strain from compressive or shearing forces.",
    },
  ];

  const getLabelColor = (value: number) => {
    if (value < 4) return "text-green-600";
    if (value < 7) return "text-yellow-600";
    return "text-destructive";
  };

  const getBarColor = (value: number) => {
    if (value < 4) return "bg-green-500";
    if (value < 7) return "bg-yellow-500";
    return "bg-destructive";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Fatigue Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map(({ label, icon: Icon, value, description }) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </div>
              <span className={`text-sm font-semibold ${getLabelColor(value)}`}>
                {value.toFixed(1)}/10
              </span>
            </div>

            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`absolute h-full transition-all duration-500 ${getBarColor(
                  value
                )}`}
                style={{ width: `${value * 10}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
