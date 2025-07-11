"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { SetInfo } from "@/types/Workout";
import { TrendingDown, Layers, Zap, Pause } from "lucide-react";

interface Props {
  set: SetInfo;
  index: number;
  updateSet: (
    index: number,
    field: keyof SetInfo,
    value: string | number
  ) => void;
}

const setTypeConfig = {
  drop: {
    icon: TrendingDown,
    title: "Drop Set",
    color: "border-orange-200 bg-orange-50",
    iconColor: "text-orange-600",
    fields: [
      { label: "Drop %", key: "drop_percent", placeholder: "20" },
      { label: "Drop Sets", key: "drop_sets", placeholder: "2" },
    ],
  },
  cluster: {
    icon: Layers,
    title: "Cluster Set",
    color: "border-blue-200 bg-blue-50",
    iconColor: "text-blue-600",
    fields: [
      { label: "Cluster Reps", key: "cluster_reps", placeholder: "3" },
      { label: "Intra Rest (s)", key: "intra_rest", placeholder: "15" },
    ],
  },
  myo_reps: {
    icon: Zap,
    title: "Myo Reps",
    color: "border-purple-200 bg-purple-50",
    iconColor: "text-purple-600",
    fields: [
      {
        label: "Activation Reps",
        key: "activation_set_reps",
        placeholder: "12",
      },
      { label: "Mini Sets", key: "mini_sets", placeholder: "3" },
    ],
  },
  rest_pause: {
    icon: Pause,
    title: "Rest Pause",
    color: "border-green-200 bg-green-50",
    iconColor: "text-green-600",
    fields: [
      { label: "Initial Reps", key: "initial_reps", placeholder: "8" },
      { label: "Pause Duration (s)", key: "pause_duration", placeholder: "10" },
    ],
  },
};

export function AdvancedSetFields({ set, index, updateSet }: Props) {
  const config = setTypeConfig[set.set_type as keyof typeof setTypeConfig];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div
      className={`mt-2 p-3 rounded-lg border ${config.color} transition-all duration-200`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Badge
          variant="secondary"
          className={`${config.iconColor} bg-transparent border-current`}
        >
          <Icon className="w-3 h-3 mr-1" />
          {config.title}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {config.fields.map((field) => (
          <div key={field.key} className="space-y-1">
            <Label className="text-xs font-medium text-muted-foreground">
              {field.label}
            </Label>
            <Input
              type="number"
              value={(set as any)[field.key] || ""}
              onChange={(e) =>
                updateSet(
                  index,
                  field.key as keyof SetInfo,
                  Number(e.target.value)
                )
              }
              placeholder={field.placeholder}
              className="h-8 text-sm text-center bg-white/50"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
