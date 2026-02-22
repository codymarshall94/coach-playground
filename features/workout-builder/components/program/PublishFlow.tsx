"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { publishProgram } from "@/services/programService";
import { cn } from "@/lib/utils";
import { PROGRAM_GRADIENTS } from "./ProgramSettingsSheet";
import type {
  ListingFAQ,
  ListingMetadata,
  Program,
  ProgramGoal,
  SkillLevel,
} from "@/types/Workout";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  DollarSign,
  Dumbbell,
  Globe,
  GraduationCap,
  Layers,
  Loader2,
  MessageCircleQuestion,
  Plus,
  Repeat,
  Sparkles,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

/* -------------------------------------------------------------------------- */
/*  Steps — Review → Listing → Price → Live                                  */
/* -------------------------------------------------------------------------- */

const STEPS = [
  {
    label: "Review",
    tagline: "ALMOST THERE",
    headline: "Review your program.",
    description:
      "Take a final look at what you've built. Once you publish, a snapshot is saved so you can keep editing privately.",
    gradient: "from-blue-500 to-indigo-500",
    bgGlow: "bg-blue-500/20",
  },
  {
    label: "Listing",
    tagline: "SELL THE VISION",
    headline: "Build your listing.",
    description:
      "Help athletes understand what they're getting. Add details about the program and answer common questions.",
    gradient: "from-orange-500 to-amber-500",
    bgGlow: "bg-orange-500/20",
  },
  {
    label: "Price",
    tagline: "YOUR TERMS",
    headline: "Set your price.",
    description:
      "Make it free for everyone, or set a price to reflect the value of your work. You can change this anytime later.",
    gradient: "from-purple-500 to-pink-500",
    bgGlow: "bg-purple-500/20",
  },
  {
    label: "Live",
    tagline: "YOU DID IT",
    headline: "You're live.",
    description:
      "Your program is published and ready to share. Find it on your profile and the marketplace.",
    gradient: "from-emerald-400 to-green-500",
    bgGlow: "bg-emerald-500/20",
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Animation variants                                                        */
/* -------------------------------------------------------------------------- */

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({
    x: dir < 0 ? 60 : -60,
    opacity: 0,
    filter: "blur(4px)",
  }),
};

const heroVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

/* -------------------------------------------------------------------------- */
/*  Goal helpers                                                              */
/* -------------------------------------------------------------------------- */

const GOAL_LABELS: Record<string, string> = {
  strength: "Strength",
  hypertrophy: "Hypertrophy",
  endurance: "Endurance",
  power: "Power",
};

const GOAL_COLORS: Record<string, string> = {
  strength: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
  hypertrophy:
    "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
  endurance:
    "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  power:
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

/* -------------------------------------------------------------------------- */
/*  Skill-level options                                                       */
/* -------------------------------------------------------------------------- */

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

/* -------------------------------------------------------------------------- */
/*  Props                                                                     */
/* -------------------------------------------------------------------------- */

interface PublishFlowProps {
  program: Program;
  onPublished: (versionId: string | null) => void;
  onClose: () => void;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function PublishFlow({ program, onPublished, onClose }: PublishFlowProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [priceInput, setPriceInput] = useState(
    program.price != null && program.price > 0 ? program.price.toString() : ""
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  /* ---- Listing metadata state ---- */
  const existingMeta = program.listing_metadata;
  const [skillLevel, setSkillLevel] = useState<SkillLevel | "">(
    existingMeta?.skill_level ?? ""
  );
  const [sessionDuration, setSessionDuration] = useState(
    existingMeta?.session_duration ?? ""
  );
  const [trainingFrequency, setTrainingFrequency] = useState(
    existingMeta?.training_frequency ?? ""
  );
  const [faqs, setFaqs] = useState<ListingFAQ[]>(
    existingMeta?.faqs ?? []
  );

  const parsedPrice = parseFloat(priceInput);
  const finalPrice = !isNaN(parsedPrice) && parsedPrice > 0 ? parsedPrice : null;
  const isFree = !finalPrice;

  const next = () => {
    setDir(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  /* ---- FAQ helpers ---- */
  const addFaq = () => setFaqs((f) => [...f, { question: "", answer: "" }]);
  const removeFaq = (index: number) =>
    setFaqs((f) => f.filter((_, i) => i !== index));
  const updateFaq = (index: number, field: keyof ListingFAQ, value: string) =>
    setFaqs((f) => f.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  /* ---- Build listing metadata object ---- */
  const buildListingMetadata = useCallback((): ListingMetadata | null => {
    const meta: ListingMetadata = {};
    if (skillLevel) meta.skill_level = skillLevel as SkillLevel;
    if (sessionDuration.trim()) meta.session_duration = sessionDuration.trim();
    if (trainingFrequency.trim()) meta.training_frequency = trainingFrequency.trim();
    const validFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());
    if (validFaqs.length > 0) meta.faqs = validFaqs;
    return Object.keys(meta).length > 0 ? meta : null;
  }, [skillLevel, sessionDuration, trainingFrequency, faqs]);

  /* ---- Compute stats ---- */
  const stats = useMemo(() => {
    const isBlocks = program.mode === "blocks";
    const blocks = program.blocks ?? [];
    const days = program.days ?? [];

    const dayCount = isBlocks
      ? blocks.reduce(
          (acc, b) =>
            acc + (b.weeks ?? []).reduce((wa, w) => wa + w.days.length, 0),
          0
        )
      : days.length;
    const blockCount = isBlocks ? blocks.length : 0;
    const weekCount = isBlocks
      ? blocks.reduce((acc, b) => acc + (b.weeks ?? []).length, 0)
      : 0;

    const allDays = isBlocks
      ? blocks.flatMap((b) => (b.weeks ?? []).flatMap((w) => w.days))
      : days;
    const exerciseCount = allDays.reduce(
      (acc, d) =>
        acc +
        (d.groups ?? []).reduce((ga, g) => ga + (g.exercises ?? []).length, 0),
      0
    );

    return { dayCount, blockCount, weekCount, exerciseCount };
  }, [program]);

  const gradient = PROGRAM_GRADIENTS[program.goal as ProgramGoal];

  /* ---- Publish ---- */
  const handlePublish = useCallback(async () => {
    setIsPublishing(true);
    try {
      const result = await publishProgram(program.id, {
        price: finalPrice,
        currency: program.currency ?? "usd",
        listing_metadata: buildListingMetadata(),
      });
      setPublishedSlug(result.slug ?? null);
      next(); // → success step
      setTimeout(() => {
        onPublished(result.versionId);
        toast.success(
          finalPrice
            ? `Published at $${finalPrice.toFixed(2)}!`
            : "Published as free!"
        );
      }, 2000);
    } catch (err) {
      console.error("Publish error:", err);
      toast.error("Failed to publish program");
    } finally {
      setIsPublishing(false);
    }
  }, [program.id, program.currency, finalPrice, onPublished, buildListingMetadata]);

  const handleNext = async () => {
    if (step === 2) {
      await handlePublish();
    } else {
      next();
    }
  };

  /* ---- Step forms (right panel) ---- */
  const renderForm = () => {
    switch (step) {
      /* ============ STEP 0 — Review ============ */
      case 0:
        return (
          <div className="space-y-6">
            {/* Program Preview Card */}
            <div className="rounded-xl border-2 border-border overflow-hidden bg-card">
              {/* Cover / gradient */}
              <div
                className="relative w-full aspect-[21/9]"
                style={
                  !program.cover_image ? { background: gradient } : undefined
                }
              >
                {program.cover_image && (
                  <Image
                    src={program.cover_image}
                    alt="Program cover"
                    fill
                    className="object-cover"
                    sizes="(max-width: 480px) 100vw, 480px"
                    unoptimized={program.cover_image.startsWith("blob:")}
                  />
                )}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium backdrop-blur-md",
                      GOAL_COLORS[program.goal] ?? "bg-muted"
                    )}
                  >
                    {GOAL_LABELS[program.goal] ?? program.goal}
                  </Badge>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold leading-snug">
                    {program.name || "Untitled Program"}
                  </h2>
                  {program.description && (
                    <p
                      className="text-sm text-muted-foreground mt-1 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: program.description }}
                    />
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {stats.dayCount} {stats.dayCount === 1 ? "day" : "days"}
                  </span>
                  {stats.blockCount > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      {stats.blockCount}{" "}
                      {stats.blockCount === 1 ? "block" : "blocks"}
                    </span>
                  )}
                  {stats.weekCount > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Repeat className="w-3.5 h-3.5" />
                      {stats.weekCount}{" "}
                      {stats.weekCount === 1 ? "week" : "weeks"}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5" />
                    {stats.exerciseCount}{" "}
                    {stats.exerciseCount === 1 ? "exercise" : "exercises"}
                  </span>
                </div>
              </div>
            </div>

            {/* What happens blurb */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <ul className="space-y-2.5">
                {[
                  "A snapshot is saved as the public version.",
                  "You can keep editing — changes stay private until you re-publish.",
                  "Your program appears on your profile and the marketplace.",
                  "You can unpublish anytime from program settings.",
                ].map((text) => (
                  <li key={text} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      /* ============ STEP 1 — Listing Details ============ */
      case 1:
        return (
          <div className="space-y-6">
            {/* Program details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                Program Details
              </div>

              {/* Skill Level */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Skill Level
                </Label>
                <Select
                  value={skillLevel}
                  onValueChange={(v) => setSkillLevel(v as SkillLevel)}
                >
                  <SelectTrigger className="h-9">
                    <span className={skillLevel ? "capitalize" : "text-muted-foreground"}>
                      {skillLevel
                        ? SKILL_LEVELS.find((s) => s.value === skillLevel)?.label
                        : "Select level"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Session Duration */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Session Duration
                </Label>
                <div className="relative">
                  <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="e.g. 60-90 mins"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
              </div>

              {/* Training Frequency */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Training Per Week
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="e.g. 5 days"
                    value={trainingFrequency}
                    onChange={(e) => setTrainingFrequency(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* FAQ section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MessageCircleQuestion className="w-4 h-4 text-muted-foreground" />
                  FAQs
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addFaq}
                  className="h-7 text-xs gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
              </div>

              {faqs.length === 0 && (
                <p className="text-xs text-muted-foreground py-2">
                  No FAQs yet. Add common questions to help potential athletes
                  understand your program.
                </p>
              )}

              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-lg border bg-card p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Question"
                          value={faq.question}
                          onChange={(e) =>
                            updateFaq(i, "question", e.target.value)
                          }
                          className="h-8 text-sm font-medium"
                        />
                        <Textarea
                          placeholder="Answer"
                          value={faq.answer}
                          onChange={(e) =>
                            updateFaq(i, "answer", e.target.value)
                          }
                          className="text-sm min-h-[60px]"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFaq(i)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0 mt-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-muted-foreground">
                All fields are optional. You can update them later by re-publishing.
              </p>
            </div>
          </div>
        );

      /* ============ STEP 2 — Price ============ */
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Price</Label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-[200px]">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="pl-8 h-12 text-lg"
                    autoFocus
                  />
                </div>
                <span className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
                  USD
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Leave empty or $0 for free. Stripe payments coming soon —
                price is displayed only.
              </p>
            </div>

            {/* Price summary card */}
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200",
                isFree
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-foreground/20 bg-foreground/5"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  isFree
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-foreground text-background"
                )}
              >
                {isFree ? (
                  <Globe className="w-5 h-5" />
                ) : (
                  <DollarSign className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {isFree ? "Free" : `$${finalPrice!.toFixed(2)}`}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {isFree
                    ? "Anyone can view this program"
                    : "Price displayed on your program page"}
                </p>
              </div>
            </div>
          </div>
        );

      /* ============ STEP 3 — Success ============ */
      case 3:
        return (
          <div className="flex flex-col items-center justify-center text-center py-6 space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center shadow-md"
              >
                <Sparkles className="w-4 h-4 text-yellow-900" />
              </motion.div>
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">
                {program.name || "Your program"} is live!
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Share it with your clients or find it on the marketplace. You
                can keep editing — changes stay private until you re-publish.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Back to editor
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  window.open(`/p/${publishedSlug ?? program.id}`, "_blank");
                }}
              >
                View Public Page
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ---- Layout ---- */
  const isLastStep = step === STEPS.length - 1;
  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-muted">
        <motion.div
          className={cn("h-full bg-gradient-to-r", currentStep.gradient)}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ---- Left panel: Hero ---- */}
        <div className="relative lg:w-[45%] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-neutral-950 to-neutral-900 px-8 py-10 lg:px-16 lg:py-0">
          {/* Animated glow */}
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className={cn(
              "absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30",
              currentStep.bgGlow
            )}
          />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0H0v60' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={heroVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-5"
              >
                {/* Tagline pill */}
                <span className="inline-block rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.15em] uppercase bg-white/10 text-white/70 backdrop-blur-sm">
                  {currentStep.tagline}
                </span>

                {/* Headline */}
                <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-[-0.03em] text-white">
                  {currentStep.headline}
                </h1>

                {/* Description */}
                <p className="text-base lg:text-lg leading-relaxed text-white/60 max-w-sm">
                  {currentStep.description}
                </p>

                {/* Step dots */}
                {!isLastStep && (
                  <div className="flex items-center gap-3 pt-4">
                    {STEPS.slice(0, -1).map((s, i) => (
                      <div
                        key={s.label}
                        className={cn(
                          "h-1 rounded-full transition-all duration-500",
                          i === step
                            ? "w-8 bg-white"
                            : i < step
                              ? "w-4 bg-white/40"
                              : "w-4 bg-white/15"
                        )}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Back to editor (mobile) */}
          {!isLastStep && (
            <div className="relative z-10 mt-6 lg:hidden">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-4"
              >
                Back to editor
              </button>
            </div>
          )}
        </div>

        {/* ---- Right panel: Form ---- */}
        <div className="flex-1 flex flex-col justify-center px-6 py-10 lg:px-16 lg:py-0 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            {/* Form content */}
            <div className="relative min-h-[420px] flex flex-col justify-center">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {renderForm()}
                </motion.div>
              </AnimatePresence>

              {/* Publishing overlay */}
              {isPublishing && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
            </div>

            {/* Navigation */}
            {!isLastStep && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={step === 0 ? onClose : prev}
                  disabled={isPublishing}
                  className={cn(
                    "gap-1.5",
                    step === 0 && "text-muted-foreground"
                  )}
                >
                  <ArrowLeft className="w-4 h-4" />
                  {step === 0 ? "Back to editor" : "Back"}
                </Button>

                <div className="flex items-center gap-3">
                  {/* Exit link (desktop) */}
                  {step === 0 && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="hidden lg:block text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  <Button
                    onClick={handleNext}
                    disabled={isPublishing}
                    className="min-w-[140px]"
                  >
                    {step === 2 ? (
                      isPublishing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          {isFree ? "Publish for Free" : `Publish at $${finalPrice!.toFixed(2)}`}
                          <Globe className="w-4 h-4 ml-1.5" />
                        </>
                      )
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
