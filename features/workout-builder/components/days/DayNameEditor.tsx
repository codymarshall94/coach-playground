import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Program, ProgramDay } from "@/types/Workout";
import { Check, Pencil } from "lucide-react";

interface DayNameEditorProps {
  program: Program;
  activeBlockIndex: number;
  activeDayIndex: number;
  editedName: string;
  setEditedName: (name: string) => void;
  updateDayDetails: (updates: Partial<ProgramDay>) => void;
  setIsEditingName: (isEditing: boolean) => void;
  isEditingName: boolean;
}

export const DayNameEditor = ({
  program,
  activeBlockIndex,
  activeDayIndex,
  editedName,
  setEditedName,
  updateDayDetails,
  setIsEditingName,
  isEditingName,
}: DayNameEditorProps) => {
  return (
    <div className="flex items-center gap-2">
      {isEditingName ? (
        <>
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="text-2xl font-bold text-foreground bg-transparent border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
            placeholder="Day Name"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateDayDetails({ name: editedName.trim() || "Untitled Day" });
                setIsEditingName(false);
              }
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              updateDayDetails({ name: editedName.trim() || "Untitled Day" });
              setIsEditingName(false);
            }}
          >
            <Check className="w-5 h-5 text-green-600 hover:text-green-700" />
          </Button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-foreground">
            {program.mode === "blocks"
              ? program.blocks![activeBlockIndex].days[activeDayIndex].name
              : program.days![activeDayIndex].name}
          </h2>
          <Pencil
            className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-black"
            onClick={() => {
              setEditedName(
                program.mode === "blocks"
                  ? program.blocks![activeBlockIndex].days[activeDayIndex].name
                  : program.days![activeDayIndex].name
              );
              setIsEditingName(true);
            }}
          />
        </>
      )}
    </div>
  );
};
