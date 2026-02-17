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
  const clamp = (x: number) =>
    Math.max(0, Math.min(100, Number.isFinite(x) ? x : 0));

  const items = [
    {
      label: "CNS Demand",
      value: clamp(avgCNS),
      Icon: Brain,
      color: "purple",
      description: "Neural fatigue from heavy loads or complex lifts.",
    },
    {
      label: "Metabolic",
      value: clamp(avgMet),
      Icon: Heart,
      color: "red",
      description: "Energy system stress from higher rep or explosive work.",
    },
    {
      label: "Joint Stress",
      value: clamp(avgJoint),
      Icon: Bone,
      color: "orange",
      description: "Structural strain from compressive or shearing forces.",
    },
  ];

  const labelColor = (v: number) =>
    v < 40 ? "text-load-low" : v < 70 ? "text-load-medium" : "text-load-high";
  const barColor = (v: number) =>
    v < 40 ? "bg-load-low" : v < 70 ? "bg-load-medium" : "bg-load-high";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Fatigue Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map(({ label, Icon, value, description }) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </div>
              <span className={`text-sm font-semibold ${labelColor(value)}`}>
                {(value / 10).toFixed(1)}/10
              </span>
            </div>

            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`absolute h-full transition-all duration-500 ${barColor(
                  value
                )}`}
                style={{ width: `${value}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
