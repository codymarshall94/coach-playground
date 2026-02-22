"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PurchasedProgram } from "@/services/purchaseService";
import { PROGRAM_GRADIENTS } from "@/features/workout-builder/components/program/ProgramSettingsSheet";
import type { ProgramGoal } from "@/types/Workout";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Dumbbell, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/** Strip HTML tags from a string for plain-text display */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const goalLabels: Record<string, string> = {
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
  program: PurchasedProgram;
}

export default function PurchasedProgramCard({ program }: Props) {
  const name = program.program_name || "Untitled program";
  const goalLabel = goalLabels[program.program_goal] ?? "Strength";
  const href = `/p/${program.program_slug ?? program.program_id}`;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card",
        "transition-all duration-200 hover:shadow-lg hover:border-border/80",
        "focus-within:ring-2 focus-within:ring-brand/40",
      )}
    >
      {/* Cover image or goal gradient */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden shrink-0"
        style={
          !program.program_cover_image
            ? {
                background:
                  PROGRAM_GRADIENTS[program.program_goal as ProgramGoal] ??
                  PROGRAM_GRADIENTS.strength,
              }
            : undefined
        }
      >
        {program.program_cover_image ? (
          <Image
            src={program.program_cover_image}
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

      <Link href={href} className="flex flex-1 flex-col p-4">
        {/* Goal category */}
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {goalLabel}
        </span>

        {/* Title */}
        <h2 className="mt-1 text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </h2>

        {/* Description */}
        {program.program_description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-snug">
            {stripHtml(program.program_description)}
          </p>
        )}

        {/* Footer: Author + purchased date */}
        <div className="mt-auto flex items-center gap-3 pt-3 text-[11px] text-muted-foreground">
          {/* Author */}
          <span className="inline-flex items-center gap-1.5 min-w-0">
            <Avatar className="h-4 w-4">
              {program.author_avatar_url && (
                <AvatarImage src={program.author_avatar_url} />
              )}
              <AvatarFallback className="text-[8px]">
                <User className="w-2.5 h-2.5" />
              </AvatarFallback>
            </Avatar>
            <span className="truncate">
              {program.author_full_name ?? program.author_username ?? "Coach"}
            </span>
          </span>

          <Badge
            className={`ml-auto text-[9px] font-semibold px-1.5 py-0 ${GOAL_COLORS[program.program_goal] ?? ""}`}
          >
            {goalLabel}
          </Badge>

          <span className="flex items-center gap-1 text-[10px]">
            <Calendar className="w-3 h-3" />
            {formatDistanceToNow(new Date(program.purchased_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </Link>
    </div>
  );
}
