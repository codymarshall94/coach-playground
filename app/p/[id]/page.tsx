import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AcquireProgramButton } from "@/components/AcquireProgramButton";
import { ViewTracker } from "@/components/ViewTracker";
import { getPublishedProgramById } from "@/services/profileService";
import { createClient } from "@/utils/supabase/server";
import { transformProgramFromSupabase } from "@/utils/program/transformProgram";
import { PROGRAM_GRADIENTS } from "@/features/workout-builder/components/program/ProgramSettingsSheet";
import type { ProgramGoal, ListingMetadata } from "@/types/Workout";
import {
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Dumbbell,
  GraduationCap,
  Layers,
  Lock,
  Repeat,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getPublishedProgramById(id);
  if (!data) return { title: "Program Not Found — PRGRM" };
  return {
    title: `${data.name} — PRGRM`,
    description:
      data.description?.replace(/<[^>]*>/g, "").slice(0, 160) ??
      "View this training program on PRGRM.",
  };
}

// ---------------------------------------------------------------------------
// Goal helpers
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

export default async function PublicProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getPublishedProgramById(id);
  if (!data) notFound();

  // Detect if viewer is the program owner
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = !!user && user.id === (data as Record<string, unknown>).user_id;

  const program = transformProgramFromSupabase(
    data as unknown as Record<string, unknown>
  );
  const profile = (data as Record<string, unknown>).profiles as {
    username: string | null;
    full_name: string | null;
    brand_name: string | null;
    account_type: string;
    avatar_url: string | null;
    logo_url: string | null;
  } | null;

  const gradient = PROGRAM_GRADIENTS[program.goal as ProgramGoal];
  const programId = id; // capture for ViewTracker
  const isFree = !data.price || data.price <= 0;
  const authorName =
    profile?.account_type === "brand" && profile?.brand_name
      ? profile.brand_name
      : profile?.full_name ?? "Unknown";
  const authorSlug = profile?.username;
  const initials = (profile?.full_name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Gather summary stats
  const dayCount =
    program.mode === "blocks"
      ? (program.blocks ?? []).reduce(
          (acc, b) => acc + b.weeks.reduce((wa, w) => wa + w.days.length, 0),
          0
        )
      : (program.days ?? []).length;
  const blockCount = program.mode === "blocks" ? (program.blocks ?? []).length : 0;
  const weekCount =
    program.mode === "blocks"
      ? (program.blocks ?? []).reduce((acc, b) => acc + b.weeks.length, 0)
      : 0;

  // Flatten all days for display
  const allDays =
    program.mode === "blocks"
      ? (program.blocks ?? []).flatMap((b) =>
          b.weeks.flatMap((w) => w.days)
        )
      : (program.days ?? []);

  const listing = (data.listing_metadata ?? program.listing_metadata ?? null) as ListingMetadata | null;

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Track page view */}
      <ViewTracker programId={programId} />

      {/* ---- Hero / Cover ---- */}
      <div
        className="relative w-full h-48 sm:h-64"
        style={!program.cover_image ? { background: gradient } : undefined}
      >
        {program.cover_image && (
          <Image
            src={program.cover_image}
            alt={program.name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
        {/* ---- Program header ---- */}
        <div className="space-y-3">
          <Badge
            className={`text-[10px] font-bold uppercase tracking-widest ${GOAL_COLORS[program.goal] ?? ""}`}
          >
            {GOAL_LABELS[program.goal] ?? program.goal}
          </Badge>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {program.name || "Untitled Program"}
          </h1>

          {/* Author */}
          {profile && (
            <Link
              href={authorSlug ? `/u/${authorSlug}` : "#"}
              className="inline-flex items-center gap-2 group"
            >
              <Avatar className="w-7 h-7 border">
                <AvatarImage
                  src={
                    profile.account_type === "brand" && profile.logo_url
                      ? profile.logo_url
                      : (profile.avatar_url ?? undefined)
                  }
                />
                <AvatarFallback className="text-[10px] font-bold">
                  {profile.account_type === "brand" ? (
                    <Building2 className="w-3 h-3" />
                  ) : (
                    initials
                  )}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {authorName}
              </span>
            </Link>
          )}

          {/* Price + Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              {isFree ? (
                "Free"
              ) : (
                <>
                  <DollarSign className="w-3.5 h-3.5" />
                  {data.price!.toFixed(2)}
                </>
              )}
            </span>
            {dayCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {dayCount} {dayCount === 1 ? "day" : "days"}
              </span>
            )}
            {blockCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                {blockCount} {blockCount === 1 ? "block" : "blocks"}
              </span>
            )}
            {weekCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5" />
                {weekCount} {weekCount === 1 ? "week" : "weeks"}
              </span>
            )}
          </div>

          {/* Promotional Description (from listing metadata) */}
          {listing?.promo_description && (
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-foreground/80"
              dangerouslySetInnerHTML={{ __html: listing.promo_description }}
            />
          )}

          {/* Acquire button */}
          <div className="pt-2">
            <AcquireProgramButton
              programId={data.id}
              isFree={isFree}
              isOwner={isOwner}
            />
          </div>
        </div>

        {/* ---- Listing metadata pills ---- */}
        {listing &&
          (listing.skill_level || listing.session_duration || listing.training_frequency) && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {listing.skill_level && (
                <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                      Skill Level
                    </p>
                    <p className="text-sm font-semibold capitalize">
                      {listing.skill_level}
                    </p>
                  </div>
                </div>
              )}
              {listing.session_duration && (
                <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                      Session Duration
                    </p>
                    <p className="text-sm font-semibold">{listing.session_duration}</p>
                  </div>
                </div>
              )}
              {listing.training_frequency && (
                <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                      Training Per Week
                    </p>
                    <p className="text-sm font-semibold">{listing.training_frequency}</p>
                  </div>
                </div>
              )}
            </div>
          )}

        <div className="h-px bg-border my-8" />

        {/* ---- FAQ section ---- */}
        {listing?.faqs && listing.faqs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold tracking-tight mb-4">FAQs</h2>
            <Accordion type="single" collapsible className="w-full">
              {listing.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm font-semibold text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="h-px bg-border my-8" />
          </section>
        )}

        {/* ---- Program preview (teaser) ---- */}
        {(() => {
          // Owners see everything; others get a limited preview
          const PREVIEW_DAY_LIMIT = isOwner ? Infinity : 3;
          let dayIndex = 0;

          if (program.mode === "blocks") {
            return (
              <div className="space-y-8">
                {(program.blocks ?? []).map((block) => (
                  <section key={block.id}>
                    <h2 className="text-xl font-semibold mb-1">{block.name}</h2>
                    {block.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {block.description}
                      </p>
                    )}

                    {block.weeks.map((week) => (
                      <div key={week.id} className="mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                          {week.label ?? `Week ${week.weekNumber}`}
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {week.days.map((day) => {
                            const idx = dayIndex++;
                            if (idx < PREVIEW_DAY_LIMIT) {
                              return <DayCard key={day.id} day={day} />;
                            }
                            return <LockedDayCard key={day.id} name={day.name} />;
                          })}
                        </div>
                      </div>
                    ))}
                  </section>
                ))}

                {!isOwner && dayCount > PREVIEW_DAY_LIMIT && (
                  <PreviewCTA
                    programId={data.id}
                    isFree={isFree}
                    isOwner={isOwner}
                    remaining={dayCount - PREVIEW_DAY_LIMIT}
                  />
                )}
              </div>
            );
          }

          return (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {allDays.map((day) => {
                  const idx = dayIndex++;
                  if (idx < PREVIEW_DAY_LIMIT) {
                    return <DayCard key={day.id} day={day} />;
                  }
                  return <LockedDayCard key={day.id} name={day.name} />;
                })}
              </div>

              {!isOwner && allDays.length > PREVIEW_DAY_LIMIT && (
                <PreviewCTA
                  programId={data.id}
                  isFree={isFree}
                  isOwner={isOwner}
                  remaining={allDays.length - PREVIEW_DAY_LIMIT}
                />
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Day card (read-only)
// ---------------------------------------------------------------------------

import type { ProgramDay } from "@/types/Workout";

function DayCard({ day }: { day: ProgramDay }) {
  const isRest = day.type === "rest" || day.type === "active_rest";
  const exerciseCount = day.groups.reduce(
    (acc, g) => acc + g.exercises.length,
    0
  );
  const setCount = day.groups.reduce(
    (acc, g) => acc + g.exercises.reduce((sa, ex) => sa + ex.sets.length, 0),
    0
  );

  return (
    <div className="rounded-xl border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">{day.name}</h4>
        {isRest && (
          <Badge variant="secondary" className="text-[10px]">
            {day.type === "active_rest" ? "Active Rest" : "Rest"}
          </Badge>
        )}
      </div>

      {!isRest && day.groups.length > 0 && (
        <div className="space-y-1.5">
          {day.groups.map((group) => (
            <div key={group.id}>
              {group.type !== "standard" && (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                  {group.type.replace("_", " ")}
                </p>
              )}
              {group.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between text-xs py-0.5"
                >
                  <span className="text-foreground/90 truncate max-w-[60%]">
                    {ex.display_name}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {ex.sets.length} &times; {formatReps(ex)}
                  </span>
                </div>
              ))}
            </div>
          ))}

          <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Dumbbell className="w-3 h-3" />
              {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Repeat className="w-3 h-3" />
              {setCount} {setCount === 1 ? "set" : "sets"}
            </span>
          </div>
        </div>
      )}

      {!isRest && day.groups.length === 0 && (
        <p className="text-xs text-muted-foreground">No exercises yet</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Locked day card (teaser placeholder)
// ---------------------------------------------------------------------------

function LockedDayCard({ name }: { name: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent z-10" />
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-muted-foreground/60">{name}</h4>
      </div>
      <div className="space-y-1.5 opacity-30 select-none" aria-hidden>
        <div className="h-3 w-3/4 rounded bg-muted-foreground/10" />
        <div className="h-3 w-1/2 rounded bg-muted-foreground/10" />
        <div className="h-3 w-2/3 rounded bg-muted-foreground/10" />
      </div>
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>Add to library to view</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Preview CTA — shown after the teaser days
// ---------------------------------------------------------------------------

function PreviewCTA({
  programId,
  isFree,
  isOwner,
  remaining,
}: {
  programId: string;
  isFree: boolean;
  isOwner: boolean;
  remaining: number;
}) {
  return (
    <div className="relative rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 p-6 text-center space-y-3">
      <p className="text-sm font-medium text-foreground">
        + {remaining} more {remaining === 1 ? "day" : "days"} in this program
      </p>
      <p className="text-xs text-muted-foreground max-w-md mx-auto">
        {isFree
          ? "Add this program to your library to unlock the full plan."
          : "Purchase this program to unlock all training days."}
      </p>
      <div className="pt-1">
        <AcquireProgramButton
          programId={programId}
          isFree={isFree}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

import type { WorkoutExercise } from "@/types/Workout";

function formatReps(ex: WorkoutExercise): string {
  if (!ex.sets.length) return "–";
  const first = ex.sets[0];
  if (ex.rep_scheme === "time" || first.rep_scheme === "time") {
    return `${first.duration ?? 30}s`;
  }
  if (first.reps_max && first.reps_max > (first.reps ?? 0)) {
    return `${first.reps}-${first.reps_max}`;
  }
  return `${first.reps ?? "–"}`;
}
