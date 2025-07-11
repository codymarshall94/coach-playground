import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SetType } from "@/types/Workout";

export const SET_TYPE_CONFIG: Record<
  SetType,
  { label: string; description: string }
> = {
  standard: {
    label: "Standard",
    description:
      "Traditional straight set — same reps, rest, and intensity each round.",
  },
  amrap: {
    label: "AMRAP",
    description:
      "As many reps as possible — push to technical failure to assess fatigue or progress.",
  },
  drop: {
    label: "Drop",
    description:
      "Sequential sets with reduced weight after each drop — minimal rest, high fatigue accumulation.",
  },
  cluster: {
    label: "Cluster",
    description:
      "Subdivide one set into smaller rep clusters with short intra-rest — ideal for power or clean form under fatigue.",
  },
  myo_reps: {
    label: "Myo-Reps",
    description:
      "One activation set followed by short-rest mini-sets — great for hypertrophy with lighter loads.",
  },
  rest_pause: {
    label: "Rest-Pause",
    description:
      "One heavy set broken up by short rest pauses — maintains high intensity in a compact volume.",
  },
};

export function SetTypeSelector({
  setType,
  onSetTypeChange,
  trigger,
}: {
  setType: SetType;
  onSetTypeChange: (setType: SetType) => void;
  trigger?: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="w-24 text-xs">
            {SET_TYPE_CONFIG[setType]?.label || "Standard"}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          {Object.entries(SET_TYPE_CONFIG).map(([key, config]) => (
            <div
              key={key}
              className="flex flex-col gap-1 border rounded-md p-2 hover:bg-muted/50 cursor-pointer"
              onClick={() => onSetTypeChange(key as SetType)}
            >
              <div className="text-sm font-medium text-foreground">
                {config.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {config.description}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
