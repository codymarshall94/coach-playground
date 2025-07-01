"use client";

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
    return (
      <div className="flex items-center space-x-3">
        <div className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-200">
          <div className="h-5 w-5 rounded-full bg-white shadow-md transition-transform" />
        </div>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="flex items-center space-x-3">
      <Sun
        className={`h-4 w-4 transition-colors ${
          isDark ? "text-gray-400" : "text-yellow-500"
        }`}
      />
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isDark
            ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
            : "bg-gradient-to-r from-gray-200 to-gray-300"
        }`}
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle theme"
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${
            isDark ? "translate-x-6 shadow-purple-200" : "translate-x-1"
          }`}
        >
          <span className="flex h-full w-full items-center justify-center">
            {isDark ? (
              <Moon className="h-3 w-3 text-purple-600 transition-all duration-300" />
            ) : (
              <Sun className="h-3 w-3 text-yellow-500 transition-all duration-300" />
            )}
          </span>
        </span>
      </button>
      <Moon
        className={`h-4 w-4 transition-colors ${
          isDark ? "text-purple-400" : "text-gray-400"
        }`}
      />
    </div>
  );
}
