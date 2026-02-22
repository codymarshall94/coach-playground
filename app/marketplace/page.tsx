import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getPublishedPrograms } from "@/services/profileService";
import { PROGRAM_GRADIENTS } from "@/features/workout-builder/components/program/ProgramSettingsSheet";
import type { ProgramGoal } from "@/types/Workout";
import {
  Building2,
  Calendar,
  DollarSign,
  Dumbbell,
  Layers,
  Search,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Marketplace — PRGRM",
  description:
    "Browse published training programs from coaches and athletes on PRGRM.",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const GOAL_LABELS: Record<string, string> = {
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function MarketplacePage() {
  const programs = await getPublishedPrograms();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="space-y-1 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">
            Browse training programs published by coaches and athletes.
          </p>
        </div>

        {/* Programs grid */}
        {programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <h2 className="text-lg font-semibold">No programs yet</h2>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              Be the first to publish a program! Open the builder, create your
              program, then publish it from the settings panel.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => {
              const dayCount =
                (program as Record<string, unknown>).program_days &&
                Array.isArray(
                  (program as Record<string, unknown>).program_days
                )
                  ? ((program as Record<string, unknown>).program_days as { count: number }[])?.[0]
                      ?.count ?? 0
                  : 0;
              const blockCount =
                (program as Record<string, unknown>).program_blocks &&
                Array.isArray(
                  (program as Record<string, unknown>).program_blocks
                )
                  ? ((program as Record<string, unknown>).program_blocks as { count: number }[])?.[0]
                      ?.count ?? 0
                  : 0;
              const goalGradient =
                PROGRAM_GRADIENTS[program.goal as ProgramGoal];
              const isFree = !program.price || program.price <= 0;

              const profile = (program as Record<string, unknown>)
                .profiles as {
                username: string | null;
                full_name: string | null;
                brand_name: string | null;
                account_type: string;
                avatar_url: string | null;
                logo_url: string | null;
              } | null;

              const authorName =
                profile?.account_type === "brand" && profile?.brand_name
                  ? profile.brand_name
                  : profile?.full_name ?? "Unknown";
              const initials = (profile?.full_name ?? "U")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <Link
                  key={program.id}
                  href={`/p/${(program as Record<string, unknown>).slug ?? program.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all duration-200"
                >
                  {/* Cover */}
                  <div
                    className="relative aspect-[4/3] w-full overflow-hidden"
                    style={
                      !program.cover_image
                        ? { background: goalGradient }
                        : undefined
                    }
                  >
                    {program.cover_image ? (
                      <Image
                        src={program.cover_image}
                        alt={program.name}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Dumbbell className="w-10 h-10 text-white/20" />
                      </div>
                    )}

                    {/* Price badge */}
                    <div className="absolute top-2 right-2">
                      <Badge
                        className={
                          isFree
                            ? "bg-green-600 text-white text-[10px] font-bold"
                            : "bg-background/90 text-foreground text-[10px] font-bold"
                        }
                      >
                        {isFree ? (
                          "Free"
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <DollarSign className="w-3 h-3" />
                            {program.price!.toFixed(2)}
                          </span>
                        )}
                      </Badge>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col p-4">
                    {/* Goal */}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {GOAL_LABELS[program.goal] ?? program.goal}
                    </span>

                    {/* Title */}
                    <h3 className="mt-1 text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {program.name || "Untitled program"}
                    </h3>

                    {/* Author */}
                    {profile && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Avatar className="w-4 h-4 border">
                          <AvatarImage
                            src={
                              profile.account_type === "brand" &&
                              profile.logo_url
                                ? profile.logo_url
                                : (profile.avatar_url ?? undefined)
                            }
                          />
                          <AvatarFallback className="text-[7px] font-bold">
                            {profile.account_type === "brand" ? (
                              <Building2 className="w-2 h-2" />
                            ) : (
                              initials
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[11px] text-muted-foreground truncate">
                          {authorName}
                        </span>
                      </div>
                    )}

                    {/* Meta chips */}
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
                        {GOAL_LABELS[program.goal] ?? program.goal}
                      </Badge>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
