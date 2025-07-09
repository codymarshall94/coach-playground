"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { ProgramDescriptionEditor } from "../ProgramDescriptionEditor";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (html: string) => void;
};

export function ProgramNotesModal({
  open,
  onOpenChange,
  value,
  onChange,
}: Props) {
  const hasText = value.trim() !== "";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="group flex items-center gap-1 text-muted-foreground hover:text-primary-foreground"
        >
          <FileText
            className={cn(
              "w-4 h-4 group-hover:text-primary-foreground",
              hasText && "text-primary"
            )}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Program Description</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <ProgramDescriptionEditor
            value={value}
            onChange={onChange}
            label="Program Notes"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
