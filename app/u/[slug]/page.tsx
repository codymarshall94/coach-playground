import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  getProfileBySlug,
  getPublicProgramsByUserId,
} from "@/services/profileService";
import { PROGRAM_GRADIENTS } from "@/features/workout-builder/components/program/ProgramSettingsSheet";
import type { ProgramGoal } from "@/types/Workout";
import {
  Building2,
  Calendar,
  DollarSign,
  Dumbbell,
  ExternalLink,
  Globe,
  Instagram,
  Layers,
  Twitter,
  Youtube,
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) return { title: "Profile Not Found — PRGRM" };
  const displayName = profile.brand_name || profile.full_name || slug;
  return {
    title: `${displayName} — PRGRM`,
    description: profile.bio ?? `Check out ${displayName} on PRGRM.`,
  };
}

// ---------------------------------------------------------------------------
// Goal badge color helper
// ---------------------------------------------------------------------------

const GOAL_COLORS: Record<string, string> = {
  strength: "bg-red-500/10 text-red-600 dark:text-red-400",
  hypertrophy: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  endurance: "bg-green-500/10 text-green-600 dark:text-green-400",
  power: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

const GOAL_LABELS: Record<string, string> = {
  strength: "Strength",
  hypertrophy: "Hypertrophy",
  endurance: "Endurance",
  power: "Power",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) notFound();

  const programs = await getPublicProgramsByUserId(profile.id);

  const displayName =
    profile.account_type === "brand" && profile.brand_name
      ? profile.brand_name
      : profile.full_name ?? slug;

  const initials = (profile.full_name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const hasSocials =
    profile.social_instagram ||
    profile.social_twitter ||
    profile.social_youtube ||
    profile.website;

  return (
    <div className="min-h-screen bg-background">
      {/* ---- Cover ---- */}
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-br from-primary/20 to-primary/5">
        {profile.cover_image_url && (
          <Image
            src={profile.cover_image_url}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* ---- Profile header ---- */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-16 flex flex-col sm:flex-row items-start sm:items-end gap-4">
          {/* Avatar / Logo */}
          <Avatar className="w-28 h-28 border-4 border-background shadow-lg">
            <AvatarImage
              src={
                profile.account_type === "brand" && profile.logo_url
                  ? profile.logo_url
                  : (profile.avatar_url ?? undefined)
              }
            />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/20 to-primary/5">
              {profile.account_type === "brand" ? (
                <Building2 className="w-8 h-8 text-primary/60" />
              ) : (
                initials
              )}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {displayName}
              </h1>
              {profile.account_type === "brand" && (
                <Badge
                  variant="secondary"
                  className="text-[10px] font-semibold uppercase tracking-wider"
                >
                  Brand
                </Badge>
              )}
            </div>
            {profile.account_type === "brand" && profile.full_name && (
              <p className="text-sm text-muted-foreground">
                by {profile.full_name}
              </p>
            )}
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          </div>
        </div>

        {/* ---- Bio ---- */}
        {profile.bio && (
          <p className="mt-4 text-sm text-foreground/80 leading-relaxed max-w-2xl whitespace-pre-line">
            {profile.bio}
          </p>
        )}

        {/* ---- Social links ---- */}
        {hasSocials && (
          <div className="flex flex-wrap gap-3 mt-4">
            {profile.website && (
              <SocialLink
                href={
                  profile.website.startsWith("http")
                    ? profile.website
                    : `https://${profile.website}`
                }
                icon={<Globe className="w-4 h-4" />}
                label={profile.website
                  .replace(/^https?:\/\//, "")
                  .replace(/\/$/, "")}
              />
            )}
            {profile.social_instagram && (
              <SocialLink
                href={`https://instagram.com/${profile.social_instagram.replace("@", "")}`}
                icon={<Instagram className="w-4 h-4" />}
                label={`@${profile.social_instagram.replace("@", "")}`}
              />
            )}
            {profile.social_twitter && (
              <SocialLink
                href={`https://x.com/${profile.social_twitter.replace("@", "")}`}
                icon={<Twitter className="w-4 h-4" />}
                label={`@${profile.social_twitter.replace("@", "")}`}
              />
            )}
            {profile.social_youtube && (
              <SocialLink
                href={
                  profile.social_youtube.startsWith("http")
                    ? profile.social_youtube
                    : `https://youtube.com/@${profile.social_youtube.replace("@", "")}`
                }
                icon={<Youtube className="w-4 h-4" />}
                label={profile.social_youtube.replace("@", "")}
              />
            )}
          </div>
        )}

        {/* ---- Divider ---- */}
        <div className="h-px bg-border mt-6" />

        {/* ---- Programs grid ---- */}
        <section className="py-8">
          <h2 className="text-lg font-semibold mb-4">
            Programs{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({programs.length})
            </span>
          </h2>

          {programs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No published programs yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => {
                const dayCount =
                  (program as Record<string, unknown>).program_days
                    ? ((program as Record<string, unknown>).program_days as { count: number }[])?.[0]?.count ?? 0
                    : 0;
                const blockCount =
                  (program as Record<string, unknown>).program_blocks
                    ? ((program as Record<string, unknown>).program_blocks as { count: number }[])?.[0]?.count ?? 0
                    : 0;
                const goalGradient =
                  PROGRAM_GRADIENTS[program.goal as ProgramGoal];

                return (
                  <Link
                    key={program.id}
                    href={`/p/${(program as Record<string, unknown>).slug ?? program.id}`}
                    className="group flex flex-col overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all duration-200"
                  >
                    {/* Cover image */}
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
                            !(program as Record<string, unknown>).price ||
                            ((program as Record<string, unknown>).price as number) <= 0
                              ? "bg-green-600 text-white text-[10px] font-bold"
                              : "bg-background/90 text-foreground text-[10px] font-bold"
                          }
                        >
                          {!(program as Record<string, unknown>).price ||
                          ((program as Record<string, unknown>).price as number) <= 0
                            ? "Free"
                            : (
                              <span className="flex items-center gap-0.5">
                                <DollarSign className="w-3 h-3" />
                                {(((program as Record<string, unknown>).price as number)).toFixed(2)}
                              </span>
                            )}
                        </Badge>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col p-4">
                      {/* Goal category */}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {GOAL_LABELS[program.goal] ?? program.goal}
                      </span>

                      {/* Program name */}
                      <h3 className="mt-1 text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {program.name || "Untitled program"}
                      </h3>

                      {/* Author */}
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {displayName}
                      </p>

                      {/* Metadata chips */}
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
        </section>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Social link chip
// ---------------------------------------------------------------------------

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-muted/50 hover:bg-muted px-2.5 py-1.5 rounded-full"
    >
      {icon}
      {label}
      <ExternalLink className="w-3 h-3 opacity-50" />
    </Link>
  );
}
