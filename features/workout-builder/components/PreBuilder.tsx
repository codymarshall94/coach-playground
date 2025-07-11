"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PreBuilder() {
  const router = useRouter();

  return (
    <div className="min-h-screen px-6 py-24 bg-background flex flex-col items-center justify-center">
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
        Choose how you’d like to start. You can create from scratch or use a
        template to speed things up.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all relative "
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
            onClick={() => router.push("/programs/builder")}
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
        You can always customize everything later — this is just your starting
        point.
      </p>
    </div>
  );
}
