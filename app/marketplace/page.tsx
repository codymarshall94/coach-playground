import { getPublishedPrograms } from "@/services/profileService";
import { createClient } from "@/utils/supabase/server";
import { Search } from "lucide-react";
import type { Metadata } from "next";
import {
  MarketplaceGrid,
  type MarketplaceProgram,
} from "./MarketplaceGrid";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Marketplace — PRGRM",
  description:
    "Browse published training programs from coaches and athletes on PRGRM.",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function MarketplacePage() {
  const [programs, supabase] = await Promise.all([
    getPublishedPrograms(),
    createClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Shape the data for the client component
  const shaped: MarketplaceProgram[] = programs.map((p) => {
    const raw = p as Record<string, unknown>;
    const dayCount =
      raw.program_days && Array.isArray(raw.program_days)
        ? ((raw.program_days as { count: number }[])?.[0]?.count ?? 0)
        : 0;
    const blockCount =
      raw.program_blocks && Array.isArray(raw.program_blocks)
        ? ((raw.program_blocks as { count: number }[])?.[0]?.count ?? 0)
        : 0;

    const profile = raw.profiles as MarketplaceProgram["profile"];

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      goal: p.goal,
      cover_image: p.cover_image ?? null,
      price: p.price ?? null,
      slug: (raw.slug as string) ?? null,
      dayCount,
      blockCount,
      profile,
    };
  });

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
        {shaped.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <h2 className="text-lg font-semibold">No programs yet</h2>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              Be the first to publish a program! Open the builder, create your
              program, then publish it from the settings panel.
            </p>
          </div>
        ) : (
          <MarketplaceGrid
            programs={shaped}
            isAuthenticated={!!user}
          />
        )}
      </div>
    </div>
  );
}
