"use client";

import type React from "react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function FloatingElement({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingElement delay={0}>
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary/10 to-primary/10 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement delay={1}>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-primary/10 to-primary/10 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement delay={2}>
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-xl" />
        </FloatingElement>
      </div>

      {/* Hero Section */}
      <motion.section className="relative z-10 min-h-screen flex items-center justify-center px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <Logo />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight"
          >
            Your Training Lab,{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent">
              Reimagined
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Create, test, and refine workouts with live feedback and intelligent
            insights. No spreadsheets, no complexity — just pure training
            science.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Link href="/programs/new">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary hover:from-primary/80 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create a Program
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              No login required • Start building immediately
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
