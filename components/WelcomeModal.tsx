"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarPlus,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

const builderSlides = [
  {
    title: "Welcome to the Builder",
    subtitle: "Your training lab starts here",
    stepName: "Welcome",
    description:
      "This is where your program takes shape. Add days, structure your split, and build a plan that fits your vision.",
    icon: <Sparkles className="w-6 h-6 text-white" />,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    title: "Add Workout & Rest Days",
    subtitle: "Customize your split",
    stepName: "Days",
    description:
      "Use the left panel to add and organize your workout days. You can add training days, rest days, or use training blocks.",
    icon: <CalendarPlus className="w-6 h-6 text-white" />,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
  },
  {
    title: "Add Exercises & Sets",
    subtitle: "Define the workout",
    stepName: "Exercises",
    description:
      "Add exercises from our library. Customize sets, reps, rest, intensity, and even advanced set types like drop sets and clusters.",
    icon: <Dumbbell className="w-6 h-6 text-white" />,
    gradient: "from-yellow-400 to-orange-500",
    bgGradient: "from-yellow-400/10 to-orange-500/10",
  },
  {
    title: "Save, Preview, and Refine",
    subtitle: "Your program evolves",
    stepName: "Save",
    description:
      "Track changes, preview your program, or save drafts as you build. You can refine anytime — it's your coaching sandbox.",
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-500/10 to-indigo-500/10",
  },
];

export function WelcomeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const isLast = step === builderSlides.length - 1;
  const currentFeature = builderSlides[step];

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => (prev + 1) % builderSlides.length);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => (prev - 1 + builderSlides.length) % builderSlides.length);
  };

  const goToStep = (index: number) => {
    setDirection(index > step ? 1 : -1);
    setStep(index);
  };

  const [hasVisited, setHasVisited] = useLocalStorage("hasVisited", true);

  useEffect(() => {
    if (hasVisited) {
      onClose();
    }
  }, [hasVisited, onClose]);

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
      transition: {
        duration: 0.1,
        ease: "easeOut",
      },
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
      transition: {
        duration: 0.1,
        ease: "easeOut",
      },
    }),
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.1,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.1, ease: "easeOut" },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full rounded-2xl p-0 border-0 bg-transparent shadow-2xl overflow-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-background/95 backdrop-blur-xl rounded-2xl border border-border/40 flex flex-col min-h-[32rem] p-0"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-40 rounded-3xl transition-all duration-700`}
          />

          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.4],
                rotate: [360, 180, 0],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute -bottom-32 -left-32 w-48 h-48 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-2xl"
            />
          </div>

          <div className="relative z-10 px-12 py-8">
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-12 gap-4"
            >
              {builderSlides.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                  onClick={() => goToStep(i)}
                  whileHover={{ scale: 1.05 }}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === step
                        ? `w-12 bg-gradient-to-r ${currentFeature.gradient}`
                        : "w-2 bg-muted group-hover:bg-muted-foreground/50"
                    }`}
                  />
                  <span
                    className={`text-xs transition-colors ${
                      i === step
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {feature.stepName}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <div className="relative h-96 flex items-center justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.1 },
                    scale: { duration: 0.1 },
                    rotateY: { duration: 0.1 },
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 gap-6"
                >
                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                    <motion.div
                      className={`relative p-8 rounded-3xl bg-gradient-to-br ${currentFeature.gradient} shadow-2xl`}
                      whileHover={{
                        scale: 1.05,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.1 },
                      }}
                      animate={{
                        boxShadow: [
                          "0 20px 40px rgba(0,0,0,0.1)",
                          "0 25px 50px rgba(0,0,0,0.15)",
                          "0 20px 40px rgba(0,0,0,0.1)",
                        ],
                      }}
                      transition={{
                        boxShadow: {
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        },
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="text-white"
                      >
                        {currentFeature.icon}
                      </motion.div>

                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${currentFeature.gradient} rounded-3xl blur-xl opacity-40 -z-10`}
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${currentFeature.gradient} rounded-3xl blur-2xl opacity-20 -z-20 scale-110`}
                      />
                    </motion.div>

                    <div className="space-y-3">
                      <motion.h2
                        className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {currentFeature.title}
                      </motion.h2>
                      <motion.p
                        className={`text-lg font-semibold bg-gradient-to-r ${currentFeature.gradient} bg-clip-text text-transparent`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {currentFeature.subtitle}
                      </motion.p>
                    </div>

                    <motion.p
                      className="text-muted-foreground text-base leading-relaxed max-w-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {currentFeature.description}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex justify-center gap-2 mt-4">
                  {builderSlides.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${
                        i === step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-center gap-4">
                  {step > 0 && (
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>
                  )}

                  {!isLast ? (
                    <Button
                      onClick={() => {
                        setHasVisited(true);
                        nextStep();
                      }}
                    >
                      Next <ArrowRight className=" w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setHasVisited(true);
                        onClose();
                      }}
                    >
                      Start Building
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
