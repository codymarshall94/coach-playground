"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-7 w-12 rounded-full bg-gray-200" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${
          isDark
            ? "bg-gradient-to-r from-primary to-accent"
            : "bg-gradient-to-r from-gray-200 to-gray-300"
        }`}
      role="switch"
      aria-checked={isDark}
      aria-label={`Activate ${isDark ? "light" : "dark"} mode`}
      aria-live="polite"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md flex items-center justify-center
          ${isDark ? "translate-x-5" : "translate-x-0"}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center h-full w-full"
          >
            {isDark ? (
              <Moon className="h-3 w-3 text-purple-600" />
            ) : (
              <Sun className="h-3 w-3 text-yellow-500" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
