"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ProgramGoal } from "@/types/Workout";
import { createGuidedProgram } from "@/utils/createGuidedProgram";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Dumbbell,
  Flame,
  Layers,
  CalendarDays,
  Target,
  Zap,
  Minus,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

type Step = "name" | "goal" | "mode" | "split";

const STEPS: Step[] = ["name", "goal", "mode", "split"];

const GOAL_OPTIONS: {
  value: ProgramGoal;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "strength",
    label: "Strength",
    description: "Get stronger — heavy loads, lower reps",
    icon: <Dumbbell className="w-5 h-5" />,
  },
  {
    value: "hypertrophy",
    label: "Hypertrophy",
    description: "Build muscle — moderate loads, higher volume",
    icon: <Flame className="w-5 h-5" />,
  },
  {
    value: "power",
    label: "Power",
    description: "Explosive performance — speed & force",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    value: "endurance",
    label: "Endurance",
    description: "Stamina & work capacity — lighter loads, high reps",
    icon: <Target className="w-5 h-5" />,
  },
];

const MODE_OPTIONS: {
  value: "days" | "blocks";
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "days",
    label: "Weekly Days",
    description: "A repeating weekly schedule (e.g. Push / Pull / Legs)",
    icon: <CalendarDays className="w-5 h-5" />,
  },
  {
    value: "blocks",
    label: "Training Blocks",
    description: "Periodic blocks with different focuses (e.g. Accumulation → Intensification)",
    icon: <Layers className="w-5 h-5" />,
  },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GuidedSetupWizard({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form state
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<ProgramGoal>("strength");
  const [mode, setMode] = useState<"days" | "blocks">("days");
  const [splitCount, setSplitCount] = useState(3);

  const step = STEPS[stepIndex];

  const canAdvance = useCallback(() => {
    if (step === "name") return name.trim().length > 0;
    return true;
  }, [step, name]);

  const goNext = useCallback(() => {
    if (stepIndex < STEPS.length - 1) {
      setDirection(1);
      setStepIndex((i) => i + 1);
    }
  }, [stepIndex]);

  const goPrev = useCallback(() => {
    if (stepIndex > 0) {
      setDirection(-1);
      setStepIndex((i) => i - 1);
    } else {
      onBack();
    }
  }, [stepIndex, onBack]);

  const handleFinish = useCallback(() => {
    const program = createGuidedProgram({ name: name.trim(), goal, mode, splitCount });
    // Store in sessionStorage so the builder can pick it up
    sessionStorage.setItem("guided-program", JSON.stringify(program));
    router.push("/programs/builder?guided=1");
  }, [name, goal, mode, splitCount, router]);

  // -----------------------------------------------------------------------
  // Step renderers
  // -----------------------------------------------------------------------

  const renderName = () => (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center">What should we call this program?</h2>
      <p className="text-sm text-muted-foreground text-center">
        Pick a name — you can always change it later.
      </p>
      <div className="w-full space-y-2">
        <Label htmlFor="program-name" className="sr-only">
          Program name
        </Label>
        <Input
          id="program-name"
          autoFocus
          placeholder='e.g. "Upper / Lower Split"'
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canAdvance()) goNext();
          }}
          className="text-center text-lg h-12"
        />
      </div>
    </div>
  );

  const renderGoal = () => (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      <h2 className="text-2xl font-bold text-center">What&apos;s your main goal?</h2>
      <p className="text-sm text-muted-foreground text-center">
        This helps us tailor scoring and recommendations.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {GOAL_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setGoal(opt.value);
              // Auto-advance after selection
              setDirection(1);
              setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
            }}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
              "hover:shadow-md hover:border-primary/40",
              goal === opt.value
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card"
            )}
          >
            <div
              className={cn(
                "mt-0.5 rounded-lg p-2",
                goal === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {opt.icon}
            </div>
            <div>
              <span className="font-semibold text-sm">{opt.label}</span>
              <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderMode = () => (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      <h2 className="text-2xl font-bold text-center">How do you want to organize it?</h2>
      <p className="text-sm text-muted-foreground text-center">
        Most people use weekly days. Blocks are great for periodized programs.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {MODE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setMode(opt.value);
              // Auto-advance
              setDirection(1);
              setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
            }}
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all",
              "hover:shadow-md hover:border-primary/40",
              mode === opt.value
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card"
            )}
          >
            <div
              className={cn(
                "rounded-lg p-3",
                mode === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {opt.icon}
            </div>
            <span className="font-semibold">{opt.label}</span>
            <p className="text-xs text-muted-foreground">{opt.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const maxCount = mode === "days" ? 7 : 8;
  const splitLabel = mode === "days" ? "training days per week" : "training blocks";

  const renderSplit = () => (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center">
        How many {splitLabel}?
      </h2>
      <p className="text-sm text-muted-foreground text-center">
        {mode === "days"
          ? "We'll fill the rest of the week with rest days."
          : "Each block starts with one week — you can add more later."}
      </p>

      <div className="flex items-center gap-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSplitCount((c) => Math.max(1, c - 1))}
          disabled={splitCount <= 1}
          aria-label="Decrease count"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-5xl font-extrabold tabular-nums w-16 text-center">
          {splitCount}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSplitCount((c) => Math.min(maxCount, c + 1))}
          disabled={splitCount >= maxCount}
          aria-label="Increase count"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {mode === "days" && (
        <p className="text-xs text-muted-foreground">
          {splitCount} workout {splitCount === 1 ? "day" : "days"} + {7 - splitCount} rest{" "}
          {7 - splitCount === 1 ? "day" : "days"}
        </p>
      )}
    </div>
  );

  const stepContent: Record<Step, React.ReactNode> = {
    name: renderName(),
    goal: renderGoal(),
    mode: renderMode(),
    split: renderSplit(),
  };

  // -----------------------------------------------------------------------
  // Progress indicator
  // -----------------------------------------------------------------------

  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen px-6 py-24 bg flex flex-col items-center justify-center">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Animated step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          {stepContent[step]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center gap-4 mt-12">
        <Button variant="ghost" onClick={goPrev}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>

        {stepIndex < STEPS.length - 1 ? (
          <Button onClick={goNext} disabled={!canAdvance()}>
            Next
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        ) : (
          <Button onClick={handleFinish}>
            Create Program
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        )}
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-2 mt-6">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              i === stepIndex ? "bg-primary" : i < stepIndex ? "bg-primary/40" : "bg-muted-foreground/20"
            )}
          />
        ))}
      </div>
    </div>
  );
}
