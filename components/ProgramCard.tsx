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
  Dumbbell,
  Eye,
  Globe,
  Layers,
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

const GOAL_COLORS: Record<string, string> = {
  strength: "bg-red-500/10 text-red-600 dark:text-red-400",
  hypertrophy: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  endurance: "bg-green-500/10 text-green-600 dark:text-green-400",
  power: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

interface Props {
  program: Program;
  viewCount?: number;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export default function ProgramCard({
  program,
  viewCount,
  onDelete,
  onDuplicate,
}: Props) {
  const name = program.name || "Untitled program";
  const goalLabel = goalLabels[program.goal] ?? "Strength";

  // Count total training days across modes
  const dayCount =
    program.mode === "blocks"
      ? (program.blocks ?? []).reduce((sum, b) => {
          if (Array.isArray(b.weeks) && b.weeks.length > 0) {
            return sum + b.weeks.reduce((ws, w) => ws + (w.days?.length ?? 0), 0);
          }
          return sum + (b.days?.length ?? 0);
        }, 0)
      : (program.days?.length ?? 0);

  const blockCount =
    program.mode === "blocks" ? (program.blocks?.length ?? 0) : 0;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card",
        "transition-all duration-200 hover:shadow-lg hover:border-border/80",
        "focus-within:ring-2 focus-within:ring-brand/40",
      )}
    >
      {/* Cover image or goal gradient with fallback icon */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden shrink-0"
        style={
          !program.cover_image
            ? { background: PROGRAM_GRADIENTS[program.goal] }
            : undefined
        }
      >
        {program.cover_image ? (
          <Image
            src={program.cover_image}
            alt=""
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Dumbbell className="w-10 h-10 text-white/20" />
          </div>
        )}
      </div>

      {/* Published badge */}
      {program.is_published && (
        <div className="absolute left-2 top-2 z-10">
          <Badge className="bg-green-600 text-white text-[10px] font-bold gap-1">
            <Globe className="w-3 h-3" />
            Published
          </Badge>
        </div>
      )}

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
        {/* Goal category */}
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {goalLabel}
        </span>

        {/* Title */}
        <h2 className="mt-1 text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </h2>

        {/* Description — 2 lines */}
        {program.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-snug">
            {stripHtml(program.description)}
          </p>
        )}

        {/* Metadata footer */}
        <div className="mt-auto flex items-center gap-3 pt-3 text-[11px] text-muted-foreground">
          {dayCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {dayCount} {dayCount === 1 ? "day" : "days"}
            </span>
          )}
          {blockCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {blockCount} {blockCount === 1 ? "block" : "blocks"}
            </span>
          )}
          <Badge
            className={`ml-auto text-[9px] font-semibold px-1.5 py-0 ${GOAL_COLORS[program.goal] ?? ""}`}
          >
            {goalLabel}
          </Badge>
          {viewCount != null && viewCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px]">
              <Eye className="w-3 h-3" />
              {viewCount >= 1000
                ? `${(viewCount / 1000).toFixed(1)}k`
                : viewCount}
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px]">
            {program.updated_at
              ? formatDistanceToNow(program.updated_at, { addSuffix: true })
              : "just now"}
          </span>
        </div>
      </Link>
    </div>
  );
}