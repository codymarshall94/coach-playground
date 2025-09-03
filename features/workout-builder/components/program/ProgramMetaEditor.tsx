import ScoreDial from "@/components/ScoreDial";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Program, ProgramGoal } from "@/types/Workout";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import InlineNameEditor from "../InlineNameEditor";
import { ProgramNotesModal } from "./ProgramNotesModal";
import { ProgramSettingsModal } from "./ProgramSettingsModal";

function tierForScore(score: number) {
  if (score >= 85) return { label: "Excellent", tone: "text-emerald-500" };
  if (score >= 70) return { label: "Good", tone: "text-blue-500" };
  if (score >= 50) return { label: "Okay", tone: "text-amber-600" };
  return { label: "Needs work", tone: "text-destructive" };
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
        "rounded-xl transition-colors",
        overviewOpen ? "bg-primary/10" : "hover:bg-muted/50"
      )}
      onClick={openOverview}
    >
      <CardContent className="p-3 flex items-center gap-3">
        <ScoreDial value={v} size={48} thickness={4} />
        <div className="flex-1">
          <div
            className={cn("text-meta", overviewOpen && "text-foreground/80")}
          >
            Program Score
          </div>
          <div className={cn("text-meta font-medium", tier.tone)}>
            {tier.label}
          </div>
        </div>
        <ChevronRight
          className={cn(
            "w-4 h-4 transition-transform",
            !overviewOpen && "group-hover:translate-x-1",
            overviewOpen && "text-foreground/80"
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
}

export const ProgramMetaEditor = ({
  program,
  programScore,
  onChange,
  onSwitchMode,
  onOpenOverview,
  overviewOpen,
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
          <ProgramSettingsModal
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
            program={program}
            onChange={onChange}
            onSwitchMode={onSwitchMode}
          />
        </div>
      </div>

      <ScoreHero
        score={programScore}
        openOverview={onOpenOverview}
        overviewOpen={overviewOpen}
      />
    </div>
  );
};
