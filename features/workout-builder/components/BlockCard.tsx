import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProgramBlock, ProgramDay } from "@/types/Workout";

export function BlockCard({
    block,
    isActive,
    onRename,
    onSelect,
    onAddWorkoutDay,
    onAddRestDay,
    onDuplicateDay,
    onRemoveDay,
    onUpdateDays,
    activeDayId,
  }: {
    block: ProgramBlock;
    isActive: boolean;
    onRename: (id: string) => void;
    onSelect: (id: string) => void;
    onAddWorkoutDay: () => void;
    onAddRestDay: () => void;
    onDuplicateDay: (id: string) => void;
    onRemoveDay: (id: string) => void;
    onUpdateDays: (updated: ProgramDay[]) => void;
    activeDayId: string | null;
  }) {
    const days = block.days ?? [];

    return (
      <div className={cn("p-4 rounded-lg border", isActive && "border-blue-500")}>
        <div className="flex justify-between items-center">
          <h3>{block.name}</h3>
          <Button onClick={() => onRename(block.id)}>Rename</Button>
        </div>
  
        <DayList
          days={block.days}
          onSelect={...}
          selectedDayId={activeDayId}
          onUpdateDays={(updated) => onUpdateDays(updated)}
          onAddWorkoutDay={onAddWorkoutDay}
          ...
        />
      </div>
    )
  }
