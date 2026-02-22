"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { TrackingType } from "@/types/Exercise";
import type { RepSchemeType, SetInfo } from "@/types/Workout";
import {
  Clock,
  Hash,
  Repeat,
  Ruler,
  SplitSquareHorizontal,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

interface SchemeOption {
  id: RepSchemeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
}

const SCHEME_OPTIONS: SchemeOption[] = [
  {
    id: "fixed",
    label: "Reps",
    description: "Standard rep count",
    icon: Hash,
    placeholder: "12",
  },
  {
    id: "range",
    label: "Rep range",
    description: "A min–max range (e.g. 8-12)",
    icon: SplitSquareHorizontal,
    placeholder: "8-12",
  },
  {
    id: "time",
    label: "Time",
    description: "Duration in seconds or minutes",
    icon: Clock,
    placeholder: "30s",
  },
  {
    id: "distance",
    label: "Distance",
    description: "Distance in metres",
    icon: Ruler,
    placeholder: "100",
  },
  {
    id: "each_side",
    label: "Each side",
    description: "Reps counted per side",
    icon: Repeat,
    placeholder: "12",
  },
  {
    id: "amrap",
    label: "AMRAP",
    description: "As many reps as possible",
    icon: Zap,
    placeholder: "",
  },
];

/** Default tracking types when none are specified on the exercise. */
const DEFAULT_TRACKING: TrackingType[] = ["fixed", "range", "amrap"];

/** Quick-pick presets for each scheme type. */
const QUICK_PICKS: Record<string, string[]> = {
  fixed: ["5", "8", "10", "12", "15", "20"],
  range: ["6-8", "8-10", "8-12", "10-15", "12-15"],
  time: ["20s", "30s", "45s", "60s", "90s"],
  distance: ["50", "100", "200", "400", "800"],
  each_side: ["6", "8", "10", "12", "15"],
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RepSchemePopoverProps {
  /** The current set data */
  set: SetInfo;
  /** Exercise tracking types — controls which scheme options appear */
  trackingTypes: TrackingType[];
  /** Called with the updated set when user applies a change */
  onApply: (updated: SetInfo) => void;
  /** Optional extra class on the trigger */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Derive the active scheme from set data. */
function deriveScheme(set: SetInfo): RepSchemeType {
  if (set.rep_scheme) return set.rep_scheme;
  if (set.set_type === "amrap") return "amrap";
  if (set.distance && set.distance > 0) return "distance";
  if (set.duration && set.duration > 0) return "time";
  if (set.per_side) return "each_side";
  if (set.reps_max && set.reps_max > 0) return "range";
  return "fixed";
}

/** Human-readable value for the cell trigger. */
function formatCellDisplay(set: SetInfo, scheme: RepSchemeType): string {
  switch (scheme) {
    case "range":
      return set.reps && set.reps_max
        ? `${set.reps}-${set.reps_max}`
        : set.reps
          ? String(set.reps)
          : "0";
    case "time":
      return set.duration ? `${set.duration}s` : "0s";
    case "distance":
      return set.distance ? `${set.distance}m` : "0m";
    case "amrap":
      return "AMRAP";
    case "each_side":
      return set.reps ? `${set.reps} e/s` : "0 e/s";
    case "fixed":
    default:
      return set.reps ? String(set.reps) : "0";
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RepSchemePopover({
  set,
  trackingTypes,
  onApply,
  className,
}: RepSchemePopoverProps) {
  const allowed = trackingTypes.length ? trackingTypes : DEFAULT_TRACKING;
  const visibleOptions = SCHEME_OPTIONS.filter((o) => allowed.includes(o.id));
  const [open, setOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<RepSchemeType | null>(
    null
  );
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeScheme = deriveScheme(set);

  // Reset state when popover closes
  useEffect(() => {
    if (!open) {
      setSelectedScheme(null);
      setInputValue("");
      setValidationError(null);
    }
  }, [open]);

  // Focus input when a scheme that needs value entry is selected
  useEffect(() => {
    if (selectedScheme && selectedScheme !== "amrap" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [selectedScheme]);

  // -----------------------------------------------------------------------
  // Apply logic — updates a single set
  // -----------------------------------------------------------------------

  const apply = useCallback(
    (scheme: RepSchemeType, raw?: string) => {
      const value = (raw ?? inputValue).trim();
      setValidationError(null);

      switch (scheme) {
        case "fixed": {
          const num = parseInt(value, 10);
          if (isNaN(num) || num <= 0) {
            setValidationError("Enter a number greater than 0");
            return;
          }
          if (num > 200) {
            setValidationError("Max 200 reps");
            return;
          }
          onApply({
            ...set,
            reps: num,
            reps_max: undefined,
            rep_scheme: "fixed",
            per_side: false,
            duration: undefined,
            distance: undefined,
          });
          break;
        }

        case "range": {
          const match = value.match(/^(\d+)\s*-\s*(\d+)$/);
          if (!match) {
            setValidationError("Use format like 8-12");
            return;
          }
          const min = parseInt(match[1], 10);
          const max = parseInt(match[2], 10);
          if (min <= 0 || max <= 0) {
            setValidationError("Both numbers must be greater than 0");
            return;
          }
          if (min >= max) {
            setValidationError("First number must be less than second");
            return;
          }
          onApply({
            ...set,
            reps: min,
            reps_max: max,
            rep_scheme: "range",
            per_side: false,
            duration: undefined,
            distance: undefined,
          });
          break;
        }

        case "time": {
          let seconds = 0;
          const mMatch = value.match(/^(\d+(?:\.\d+)?)\s*m$/i);
          const sMatch = value.match(/^(\d+)\s*s?$/i);
          if (mMatch) seconds = Math.round(parseFloat(mMatch[1]) * 60);
          else if (sMatch) seconds = parseInt(sMatch[1], 10);
          if (seconds <= 0) {
            setValidationError("Enter seconds (e.g. 30s) or minutes (e.g. 1.5m)");
            return;
          }
          onApply({
            ...set,
            reps: 0,
            duration: seconds,
            rep_scheme: "time",
            per_side: false,
            distance: undefined,
          });
          break;
        }

        case "each_side": {
          const num = parseInt(value, 10);
          if (isNaN(num) || num <= 0) {
            setValidationError("Enter a number greater than 0");
            return;
          }
          onApply({
            ...set,
            reps: num,
            rep_scheme: "each_side",
            per_side: true,
            duration: undefined,
            distance: undefined,
          });
          break;
        }

        case "distance": {
          const num = parseFloat(value);
          if (isNaN(num) || num <= 0) {
            setValidationError("Enter a distance in metres (e.g. 100)");
            return;
          }
          onApply({
            ...set,
            reps: 0,
            distance: num,
            rep_scheme: "distance",
            per_side: false,
            duration: undefined,
          });
          break;
        }

        case "amrap": {
          onApply({
            ...set,
            reps: 0,
            rep_scheme: "amrap",
            set_type: "amrap",
            per_side: false,
            duration: undefined,
            distance: undefined,
          });
          break;
        }
      }

      setOpen(false);
    },
    [inputValue, set, onApply]
  );

  // -----------------------------------------------------------------------
  // Selection handler
  // -----------------------------------------------------------------------

  const handleSelect = (scheme: RepSchemeType) => {
    if (scheme === "amrap") {
      apply("amrap");
      return;
    }

    setSelectedScheme(scheme);

    // Pre-fill input with the set's current data
    if (scheme === "fixed") {
      setInputValue(set.reps ? String(set.reps) : "");
    } else if (scheme === "range") {
      setInputValue(
        set.reps && set.reps_max
          ? `${set.reps}-${set.reps_max}`
          : set.reps
            ? String(set.reps)
            : ""
      );
    } else if (scheme === "time") {
      setInputValue(set.duration ? `${set.duration}s` : "");
    } else if (scheme === "distance") {
      setInputValue(set.distance ? String(set.distance) : "");
    } else if (scheme === "each_side") {
      setInputValue(set.reps ? String(set.reps) : "");
    }
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  const display = formatCellDisplay(set, activeScheme);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "h-6 w-full flex items-center justify-center text-xs font-medium cursor-pointer",
            "hover:bg-muted/30 transition-colors outline-none",
            className
          )}
        >
          {display}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-0" align="start">
        {/* Scheme list */}
        {!selectedScheme && (
          <div className="divide-y divide-border">
            {visibleOptions.map((option) => {
              const isActive = activeScheme === option.id;
              return (
                <button
                  key={option.id}
                  className={cn(
                    "w-full text-left px-3 py-2 cursor-pointer transition-colors",
                    "hover:bg-muted/40 focus:bg-muted/40 focus:outline-none",
                    isActive && "bg-muted/30"
                  )}
                  onClick={() => handleSelect(option.id)}
                >
                  <div className="flex items-center gap-2">
                    <option.icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{option.label}</div>
                      <p className="text-[11px] text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                    {isActive && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Value input */}
        {selectedScheme && selectedScheme !== "amrap" && (
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedScheme(null);
                  setValidationError(null);
                }}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ← Back
              </button>
              <span className="text-sm font-medium">
                {SCHEME_OPTIONS.find((o) => o.id === selectedScheme)?.label}
              </span>
            </div>

            {/* Quick picks */}
            {QUICK_PICKS[selectedScheme] && (
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PICKS[selectedScheme].map((val) => (
                  <button
                    key={val}
                    onClick={() => apply(selectedScheme, val)}
                    className={cn(
                      "h-7 min-w-[2.25rem] px-2 rounded-md text-xs font-medium transition-colors",
                      "bg-muted/60 hover:bg-primary/10 hover:text-primary",
                      "border border-transparent hover:border-primary/20",
                      "cursor-pointer"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setValidationError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") apply(selectedScheme);
                  if (e.key === "Escape") setSelectedScheme(null);
                }}
                placeholder={
                  SCHEME_OPTIONS.find((o) => o.id === selectedScheme)
                    ?.placeholder ?? ""
                }
                className={cn(
                  "h-8 text-sm font-mono",
                  validationError && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
              <Button
                size="sm"
                className="h-8 px-3"
                onClick={() => apply(selectedScheme)}
              >
                Apply
              </Button>
            </div>

            {validationError && (
              <p className="text-[11px] text-destructive">{validationError}</p>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
