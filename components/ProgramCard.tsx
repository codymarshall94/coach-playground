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
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Copy,
  Dumbbell,
  Heart,
  Layers,
  MoreVertical,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";

const goalConfig: Record<
  ProgramGoal,
  { label: string; icon: typeof Dumbbell; className: string; accent: string }
> = {
  strength: {
    label: "Strength",
    icon: Dumbbell,
    className: "text-load-high bg-load-high/10",
    accent: "bg-load-high",
  },
  hypertrophy: {
    label: "Hypertrophy",
    icon: Layers,
    className: "text-brand bg-brand/10",
    accent: "bg-brand",
  },
  endurance: {
    label: "Endurance",
    icon: Heart,
    className: "text-info bg-info/10",
    accent: "bg-info",
  },
  power: {
    label: "Power",
    icon: Zap,
    className: "text-warning bg-warning/10",
    accent: "bg-warning",
  },
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
  const goal = goalConfig[program.goal] ?? goalConfig.strength;
  const GoalIcon = goal.icon;

  const itemCount =
    program.mode === "blocks"
      ? (program.blocks?.length ?? 0)
      : (program.days?.length ?? 0);
  const itemLabel = program.mode === "blocks" ? "blocks" : "days";

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card",
        "transition-all duration-200 hover:shadow-lg hover:border-border/80",
        "focus-within:ring-2 focus-within:ring-brand/40"
      )}
    >
      {/* Goal-colored accent bar */}
      <div className={cn("h-1", goal.accent)} />

      {/* Actions dropdown */}
      <div className="absolute right-2 top-3 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg">
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
                    console.debug("[ProgramCard] delete menu clicked", { id: program.id, name: program.name });
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
        className="flex flex-1 flex-col p-4 pt-3"
      >
        {/* Header: goal icon + name + description */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              goal.className
            )}
          >
            <GoalIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold leading-tight">
              {name}
            </h2>
            {program.description && (
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {program.description}
              </p>
            )}
          </div>
        </div>

        {/* Metadata footer */}
        <div className="mt-auto flex items-center gap-2 pt-2 border-t border-border/50">
          <Badge
            variant="secondary"
            className="text-[10px] font-medium px-1.5 py-0"
          >
            {goal.label}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] font-medium px-1.5 py-0"
          >
            {itemCount} {itemLabel}
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