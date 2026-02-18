"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Program, ProgramGoal } from "@/types/Workout";
import { PROGRAM_GRADIENTS } from "@/features/workout-builder/components/program/ProgramSettingsSheet";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Copy,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/** Strip HTML tags from a string for plain-text display */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const goalLabels: Record<ProgramGoal, string> = {
  strength: "Strength",
  hypertrophy: "Hypertrophy",
  endurance: "Endurance",
  power: "Power",
};

interface Props {
  program: Program;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export default function ProgramCard({
  program,
  onDelete,
  onDuplicate,
}: Props) {
  const name = program.name || "Untitled program";
  const goalLabel = goalLabels[program.goal] ?? "Strength";

  // Always count total training days, even in blocks mode
  const dayCount =
    program.mode === "blocks"
      ? (program.blocks ?? []).reduce((sum, b) => sum + (b.days?.length ?? 0), 0)
      : (program.days?.length ?? 0);

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card",
        "transition-all duration-200 hover:shadow-lg hover:border-border/80",
        "focus-within:ring-2 focus-within:ring-brand/40",
      )}
    >
      {/* Cover image or default gradient — taller, unobstructed */}
      <div
        className="relative h-44 w-full overflow-hidden shrink-0"
        style={
          !program.cover_image
            ? { background: PROGRAM_GRADIENTS[program.goal] }
            : undefined
        }
      >
        {program.cover_image && (
          <Image
            src={program.cover_image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 400px"
          />
        )}
      </div>

      {/* Actions dropdown */}
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-lg bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 hover:text-white"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {onDuplicate && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDuplicate(program.id);
                }}
              >
                <Copy className="mr-2 h-3.5 w-3.5" />
                Duplicate
              </DropdownMenuItem>
            )}
            {onDuplicate && onDelete && <DropdownMenuSeparator />}
            {onDelete && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(program.id);
                }}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link
        href={`/programs/${program.id}`}
        className="flex flex-1 flex-col p-4"
      >
        {/* Title */}
        <h2 className="truncate text-base font-semibold leading-tight">
          {name}
        </h2>

        {/* Description — 2 lines */}
        {program.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground leading-snug">
            {stripHtml(program.description)}
          </p>
        )}

        {/* Metadata footer */}
        <div className="mt-auto flex items-center gap-2 pt-3 border-t border-border/50">
          <Badge
            variant="secondary"
            className="text-[10px] font-medium px-1.5 py-0"
          >
            {goalLabel}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] font-medium px-1.5 py-0"
          >
            {dayCount} {dayCount === 1 ? "day" : "days"}
          </Badge>
          <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-2.5 w-2.5" />
            {program.updated_at
              ? formatDistanceToNow(program.updated_at, { addSuffix: true })
              : "just now"}
          </span>
        </div>
      </Link>
    </div>
  );
}