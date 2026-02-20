"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, HandHelping, Plus, Sparkles, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GuidedSetupWizard from "./GuidedSetupWizard";

type Screen = "choose" | "setup-choice" | "guided";

export default function PreBuilder() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("choose");

  // -------------------------------------------------------------------------
  // Guided wizard (full-screen takeover)
  // -------------------------------------------------------------------------
  if (screen === "guided") {
    return <GuidedSetupWizard onBack={() => setScreen("setup-choice")} />;
  }

  // -------------------------------------------------------------------------
  // Setup choice: "Help me set it up" vs "I'll do it myself"
  // -------------------------------------------------------------------------
  if (screen === "setup-choice") {
    return (
      <div className="min-h-screen px-6 py-24 bg flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-4xl font-extrabold text-center mb-3 tracking-tight"
        >
          How would you like to start?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-muted-foreground text-center max-w-xl mb-10 text-base"
        >
          We can walk you through the basics, or you can jump straight in.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
          {/* Guided */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setScreen("guided")}
            className={cn(
              "bg-card border border-border rounded-2xl p-6 shadow-sm",
              "hover:shadow-xl hover:border-primary/40 transition-all text-left relative"
            )}
          >
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-primary/60 to-primary" />
            <div className="flex items-center gap-3 mb-3 mt-1">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <HandHelping className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">Help me set it up</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Answer a few quick questions and we&apos;ll scaffold your program
              &mdash; name, goal, mode, and split.
            </p>
          </motion.button>

          {/* Skip */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/programs/builder")}
            className={cn(
              "bg-card border border-border rounded-2xl p-6 shadow-sm",
              "hover:shadow-xl hover:border-muted-foreground/30 transition-all text-left relative"
            )}
          >
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/60" />
            <div className="flex items-center gap-3 mb-3 mt-1">
              <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                <Wrench className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">I&apos;ll do it myself</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Jump straight into the builder with a blank program.
            </p>
          </motion.button>
        </div>

        <Button
          variant="ghost"
          className="mt-8"
          onClick={() => setScreen("choose")}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Default: original "Start from Scratch" / "Use a Template" screen
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen px-6 py-24 bg flex flex-col items-center justify-center">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-4 tracking-tight"
      >
        Build Your Program
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-muted-foreground text-center max-w-xl mb-12 text-base"
      >
        Choose how you&apos;d like to start. You can create from scratch or use
        a template to speed things up.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600" />
          <div className="absolute -top-2 -left-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-300 z-10">
            Most Flexible
          </div>

          <h2 className="text-xl font-bold flex items-center gap-2 mt-2 mb-2">
            <Plus className="w-5 h-5 text-green-600" />
            Start from Scratch
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Build a program step-by-step, fully your way.
          </p>
          <Button
            onClick={() => setScreen("setup-choice")}
            className="w-full"
          >
            Create Program
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600" />
          <div className="absolute -top-2 -left-2 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 z-10">
            Fastest Setup
          </div>

          <h2 className="text-xl font-bold flex items-center gap-2 mt-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Use a Template
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Pick from popular program structures to skip setup steps.
          </p>
          <Button
            onClick={() => router.push("/programs/templates")}
            variant="outline"
            className="w-full"
          >
            Browse Templates
          </Button>
        </motion.div>
      </div>

      <p className="mt-12 text-sm text-muted-foreground text-center max-w-md">
        You can always customize everything later &mdash; this is just your
        starting point.
      </p>
    </div>
  );
}
