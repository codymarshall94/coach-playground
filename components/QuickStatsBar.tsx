"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CATEGORY_DISPLAY_MAP } from "@/constants/movement-category";
import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";
import { Muscle } from "@/types/Workout";
import { WorkoutSummaryStats } from "@/types/WorkoutSummary";
import {
  Brain,
  Clock,
  Flame,
  PanelsLeftRight,
  Repeat,
  Target,
  Weight,
} from "lucide-react";
import { useState } from "react";

const STAT_OPTIONS = [
  { key: "fatigue", label: "Fatigue", icon: <Brain className="w-4 h-4" /> },
  {
    key: "activation",
    label: "Top Muscle",
    icon: <Target className="w-4 h-4" />,
  },
  { key: "movement", label: "Movement", icon: <Repeat className="w-4 h-4" /> },
  { key: "recovery", label: "Recovery", icon: <Clock className="w-4 h-4" /> },
  { key: "volume", label: "Volume", icon: <Weight className="w-4 h-4" /> },
  { key: "energy", label: "Energy", icon: <Flame className="w-4 h-4" /> },
];

export const QuickStatsBar = ({
  summary,
}: {
  summary: WorkoutSummaryStats;
}) => {
  const [activeStats, setActiveStats] = useState<string[]>([
    "fatigue",
    "activation",
  ]);

  const toggleStat = (key: string) => {
    setActiveStats((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  if (summary.topMuscles.length === 0) {
    return null;
  }

  return (
    <div className="w-full border-b border-gray-200 bg-white px-6 py-2 flex items-center justify-between text-sm text-gray-700">
      <div className="flex gap-6 flex-wrap">
        {activeStats.includes("fatigue") && (
          <div className="flex items-center gap-1">
            <Brain className="w-4 h-4 text-purple-600" />
            <span>Fatigue:</span>
            <span className="font-medium text-gray-800">
              {(summary.avgFatigue * 10).toFixed(1)}/10
            </span>
          </div>
        )}
        {activeStats.includes("activation") && (
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4 text-red-600" />
            <span>Top Muscle:</span>
            <span className="font-medium text-gray-800">
              {MUSCLE_DISPLAY_MAP[summary.topMuscles[0]?.[0] as Muscle]}
              {Math.round(summary.topMuscles[0]?.[1] * 100) || 0}%
            </span>
          </div>
        )}
        {activeStats.includes("movement") && (
          <div className="flex items-center gap-1">
            <Repeat className="w-4 h-4 text-blue-600" />
            <span>Patterns:</span>
            <span className="font-medium text-gray-800">
              {Object.entries(summary.movementFocus)
                .map(([m, c]) => `${CATEGORY_DISPLAY_MAP[m]} x${c}`)
                .join(", ")}
            </span>
          </div>
        )}
        {activeStats.includes("recovery") && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-green-600" />
            <span>Recovery:</span>
            <span className="font-medium text-gray-800">
              {summary.avgRecovery.toFixed(1)} days
            </span>
          </div>
        )}
        {activeStats.includes("volume") && (
          <div className="flex items-center gap-1">
            <Weight className="w-4 h-4 text-yellow-600" />
            <span>Volume:</span>
            <span className="font-medium text-gray-800">
              {summary.totalVolume.toFixed(1)} kg·reps
            </span>
          </div>
        )}
        {activeStats.includes("energy") && (
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-red-600" />
            <span>Energy:</span>
            <span className="font-medium text-gray-800">
              {summary.avgMet.toFixed(1)} kcal
            </span>
          </div>
        )}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button className="p-1.5 rounded hover:bg-gray-100 transition">
            <PanelsLeftRight className="w-5 h-5 text-gray-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="space-y-2 text-sm">
            {STAT_OPTIONS.map((opt) => (
              <label key={opt.key} className="flex items-center gap-2">
                <Checkbox
                  checked={activeStats.includes(opt.key)}
                  onCheckedChange={() => toggleStat(opt.key)}
                />
                {opt.icon}
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
