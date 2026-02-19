import ScoreDial from "@/components/ScoreDial";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Program, ProgramGoal } from "@/types/Workout";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import InlineNameEditor from "../InlineNameEditor";
import { ProgramNotesModal } from "./ProgramNotesModal";
import { ProgramSettingsSheet } from "./ProgramSettingsSheet";

function tierForScore(score: number) {
  if (score >= 80) return { label: "Great", color: "text-positive" };
  if (score >= 60) return { label: "Good", color: "text-load-medium" };
  if (score >= 40) return { label: "Fair", color: "text-load-high" };
  return { label: "Needs work", color: "text-destructive" };
}

export function ScoreHero({
  score,
  openOverview,
  overviewOpen,
}: {
  score: number;
  openOverview?: () => void;
  overviewOpen: boolean;
}) {
  const v = Math.max(0, Math.min(100, Math.round(score)));
  const tier = tierForScore(v);

  return (
    <Card
      className={cn(
        "rounded-xl cursor-pointer transition-colors",
        overviewOpen ? "bg-primary/10" : "hover:bg-muted/50"
      )}
      onClick={openOverview}
    >
      <CardContent className="p-2.5 flex items-center gap-2.5">
        <ScoreDial value={v} size={36} thickness={3.5} />
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <span className="text-xs font-medium text-foreground">
            Program Score
          </span>
          <span className={cn("text-[11px] font-medium", tier.color)}>
            {tier.label}
          </span>
        </div>
        <ChevronRight
          className={cn(
            "w-4 h-4 shrink-0 text-muted-foreground transition-transform",
            overviewOpen && "rotate-90"
          )}
        />
      </CardContent>
    </Card>
  );
}

interface ProgramMetaEditorProps {
  program: Program;
  programScore: number;
  onChange: (
    fields: Partial<{ name: string; description: string; goal: ProgramGoal }>
  ) => void;
  onSwitchMode: (updated: Program) => void;
  onOpenOverview?: () => void;
  overviewOpen: boolean;
  hideScore?: boolean;
}

export const ProgramMetaEditor = ({
  program,
  programScore,
  onChange,
  onSwitchMode,
  onOpenOverview,
  overviewOpen,
  hideScore = false,
}: ProgramMetaEditorProps) => {
  const [editedName, setEditedName] = useState(program.name || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  const handleSave = (next: string) => {
    const trimmed = next.trim();
    if (trimmed) onChange({ name: trimmed });
    setEditedName(trimmed);
    setIsEditingName(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
        <InlineNameEditor
          name={editedName}
          onSave={handleSave}
          onEditingChange={setIsEditingName}
          isEditing={isEditingName}
          placeholder="Program name"
          size="lg"
        />

        <div className="flex items-center gap-2">
          <ProgramNotesModal
            open={notesOpen}
            onOpenChange={setNotesOpen}
            value={program.description}
            onChange={(desc) => onChange({ ...program, description: desc })}
          />
          <ProgramSettingsSheet
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
            program={program}
            onChange={onChange}
            onSwitchMode={onSwitchMode}
          />
        </div>
      </div>

      {!hideScore && (
        <ScoreHero
          score={programScore}
          openOverview={onOpenOverview}
          overviewOpen={overviewOpen}
        />
      )}
    </div>
  );
};
