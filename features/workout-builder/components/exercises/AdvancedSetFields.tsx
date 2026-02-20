"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SetInfo } from "@/types/Workout";

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
    title: "Drop Set",
    fields: [
      { label: "Drop %", key: "drop_percent", placeholder: "e.g. 20" },
      { label: "Drop Sets", key: "drop_sets", placeholder: "e.g. 2" },
    ],
  },
  cluster: {
    title: "Cluster Set",
    fields: [
      { label: "Cluster Reps", key: "cluster_reps", placeholder: "e.g. 3" },
      { label: "Intra Rest (s)", key: "intra_rest", placeholder: "e.g. 15" },
    ],
  },
  myo_reps: {
    title: "Myo Reps",
    fields: [
      {
        label: "Activation Reps",
        key: "activation_set_reps",
        placeholder: "e.g. 12",
      },
      { label: "Mini Sets", key: "mini_sets", placeholder: "e.g. 3" },
    ],
  },
  rest_pause: {
    title: "Rest Pause",
    fields: [
      { label: "Initial Reps", key: "initial_reps", placeholder: "e.g. 8" },
      { label: "Pause Duration (s)", key: "pause_duration", placeholder: "e.g. 10" },
    ],
  },
};

export function AdvancedSetFields({ set, index, updateSet }: Props) {
  const config = setTypeConfig[set.set_type as keyof typeof setTypeConfig];

  if (!config) return null;

  return (
    <div className={`mt-2 p-3 rounded-lg border transition-all duration-200`}>
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
              className="h-8 text-sm text-center bg-white/50 placeholder:text-muted-foreground/50 placeholder:font-normal placeholder:italic"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
