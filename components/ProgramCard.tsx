"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Program } from "@/types/Workout";
import { formatDistanceToNow } from "date-fns";
import { Flame, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  program: Program;
  onDelete?: (id: string) => Promise<void> | void;
};

export default function ProgramCard({ program, onDelete }: Props) {
  const [openConfirm, setOpenConfirm] = useState(false);

  const name = program.name || "Untitled program";
  const modeLabel = program.mode === "blocks" ? "Block-based" : "Day-based";
  const dayCount = {
    days: program.days?.length ?? 0,
    blocks: program.blocks?.length ?? 0,
  };

  const dayCountLabel =
    dayCount.days > 0 ? `${dayCount.days} days` : `${dayCount.blocks} blocks`;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card shadow-sm",
        "transition-all hover:shadow-md hover:scale-[1.01] focus-within:ring-2 focus-within:ring-brand/40"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-primary"
        )}
      />

      <div className="absolute right-2 top-2 z-10">
        <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full shadow-sm"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setOpenConfirm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this program?</AlertDialogTitle>
              <AlertDialogDescription>
                This can’t be undone and will permanently remove the program and
                its workouts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async (e) => {
                  e.stopPropagation(); // defensive, prevents bubbling into Link
                  setOpenConfirm(false); // ✅ close first
                  await onDelete?.(program.id); // then delete
                  toast.success("Program deleted successfully");
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Link href={`/programs/${program.id}`} className="block p-5">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h2 className="truncate text-lg font-semibold leading-tight">
            {name}
          </h2>
          <Flame className="h-4 w-4 text-orange-500 transition-transform group-hover:scale-110" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">{modeLabel}</Badge>
          <Badge variant="outline">{dayCountLabel}</Badge>
          {program.updated_at && (
            <>
              <span>{formatDistanceToNow(program.updated_at)} ago</span>
            </>
          )}
        </div>
      </Link>
    </div>
  );
}
