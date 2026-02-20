"use client";

import { RichTextRenderer } from "@/components/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useTemplates from "@/hooks/useTemplates";
import { PROGRAM_GRADIENTS } from "@/features/workout-builder/components/program/ProgramSettingsSheet";
import type { ProgramGoal } from "@/types/Workout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bolt,
  Dumbbell,
  Flame,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface GoalMeta {
  label: string;
  icon: LucideIcon;
}

const goalSections: Record<ProgramGoal, GoalMeta> = {
  hypertrophy: { label: "Hypertrophy Programs", icon: Dumbbell },
  strength: { label: "Strength Programs", icon: Flame },
  power: { label: "Athletic Power Programs", icon: Bolt },
  endurance: { label: "Conditioning & Endurance", icon: HeartPulse },
};

export default function TemplateChooserPage() {
  const router = useRouter();
  const { templates, isLoading, error } = useTemplates();

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-muted animate-pulse rounded" />
          <div className="h-5 w-96 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border bg-card"
              >
                <div className="h-32 bg-muted/60 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-full bg-muted/40 animate-pulse rounded" />
                  <div className="h-4 w-2/3 bg-muted/40 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <p className="text-destructive">Failed to load templates.</p>
      </div>
    );
  }

  // Group templates by goal
  const byGoal = (goal: string) =>
    (templates ?? []).filter((t: any) => t.goal === goal);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Button variant="outline" className="mb-8" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="flex justify-between items-center mb-8">
        <motion.h1
          className="text-4xl font-extrabold mb-4 tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Choose a Template
        </motion.h1>
      </div>

      <motion.p
        className="text-muted-foreground text-base mb-12 max-w-xl"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Start quickly with a structured layout. You can fully customize your
        program later.
      </motion.p>

      {(Object.keys(goalSections) as Array<keyof typeof goalSections>).map(
        (goalKey, sectionIndex) => {
          const sectionTemplates = byGoal(goalKey);
          if (!sectionTemplates.length) return null;

          const meta = goalSections[goalKey];
          const Icon = meta.icon;
          const gradient = PROGRAM_GRADIENTS[goalKey];

          return (
            <motion.section
              key={goalKey}
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: sectionIndex * 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: gradient }}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-display text-foreground">{meta.label}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectionTemplates.map((template: any, index: number) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      onClick={() =>
                        router.push(
                          `/programs/builder?template=${template.id}`
                        )
                      }
                      className="cursor-pointer group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:shadow-lg hover:border-border/80 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-brand/40"
                    >
                      {/* Gradient banner with decorative icon */}
                      <div
                        className="relative h-32 w-full shrink-0 overflow-hidden"
                        style={{ background: gradient }}
                      >
                        {/* Large decorative icon */}
                        <Icon className="absolute -bottom-3 -right-3 w-24 h-24 text-white/10 rotate-[-15deg] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-10deg]" />
                        {/* Small icon badge */}
                        <div className="absolute top-3 left-3 flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        {/* Badges on banner */}
                        <div className="absolute bottom-3 left-3 flex gap-2">
                          <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-sm text-[11px] hover:bg-white/30">
                            {template.mode === "blocks" ? "Blocks" : "Days"}
                          </Badge>
                          <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-sm text-[11px] hover:bg-white/30">
                            {`${template.daysCount ?? 0} Days`}
                          </Badge>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="text-title group-hover:text-foreground transition-colors">
                          {template.name}
                        </h3>

                        {template.description && (
                          <div className="mt-2 text-sm text-muted-foreground line-clamp-3 min-h-[3.75rem]">
                            <RichTextRenderer
                              html={template.description}
                              truncate
                            />
                          </div>
                        )}

                        {/* CTA footer */}
                        <div className="mt-auto pt-4 flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          Use this template
                          <ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        }
      )}
    </div>
  );
}
