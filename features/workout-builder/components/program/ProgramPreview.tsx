"use client";

import { Button } from "@/components/ui/button";
import { Program } from "@/types/Workout";
import { Eye } from "lucide-react";
import { PDFLayoutPlanner } from "@/features/workout-builder/components/program/PDFLayoutPlanner";

export default function ProgramPreview({
  open,
  onOpenChange,
  program,
}: {
  program: Program;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <>
      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-foreground"
        onClick={() => onOpenChange(true)}
      >
        <Eye className="w-4 h-4" />
        PDF Designer
      </Button>

      {open && (
        <PDFLayoutPlanner
          program={program}
          onClose={() => onOpenChange(false)}
        />
      )}
    </>
  );
}
