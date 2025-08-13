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
import { motion } from "motion/react";
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative transition-all duration-200",
            value && "text-primary "
          )}
        >
          <FileText className="w-4 h-4" />
          {value && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full"
            />
          )}
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
