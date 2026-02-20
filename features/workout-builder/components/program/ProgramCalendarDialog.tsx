"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Program, ProgramDay } from "@/types/Workout";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAY_NAMES_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Start-of-week offsets matching JS getDay(): Sun=0 … Sat=6 */
type StartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const START_DAY_OPTIONS: { value: StartDay; label: string }[] = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

interface CalendarDay {
  date: Date;
  /** Program day mapped to this calendar date, if any */
  programDay?: ProgramDay;
  /** Block name this day belongs to */
  blockLabel?: string;
  /** Week label (e.g. "W1") */
  weekLabel?: string;
  /** Whether this date is inside the program range */
  inRange: boolean;
}

/**
 * Flatten program into a sequential list of ProgramDays with metadata.
 * Blocks mode → iterate blocks > weeks > days.
 * Days mode  → iterate flat days list, treat every 7 as a "week".
 */
function flattenProgram(program: Program) {
  const sequence: {
    day: ProgramDay;
    blockLabel?: string;
    weekLabel?: string;
  }[] = [];

  if (program.mode === "blocks" && program.blocks?.length) {
    for (const block of program.blocks) {
      // Guard: block.weeks is typed ProgramWeek[] but DB may return the
      // legacy integer column if the query didn't embed program_weeks.
      const weeks = Array.isArray(block.weeks) ? block.weeks : [];
      if (weeks.length > 0) {
        for (const week of weeks) {
          for (const day of week.days ?? []) {
            sequence.push({
              day,
              blockLabel: block.name,
              weekLabel: week.label ?? `W${week.weekNumber}`,
            });
          }
        }
      } else {
        // Fallback: iterate block.days directly (legacy or flat blocks)
        for (const day of block.days ?? []) {
          sequence.push({ day, blockLabel: block.name });
        }
      }
    }
  } else if (program.days?.length) {
    for (const day of program.days) {
      sequence.push({ day });
    }
  }

  return sequence;
}

/**
 * Build an array of CalendarDay covering the full months that contain the program range.
 */
function buildCalendarGrid(
  program: Program,
  startDate: Date,
  startDayOffset: StartDay
): { months: { year: number; month: number; weeks: CalendarDay[][] }[] } {
  const sequence = flattenProgram(program);
  if (sequence.length === 0) return { months: [] };

  // Map each program day to a calendar date (1 day per entry)
  const dayMap = new Map<string, (typeof sequence)[number]>();
  const cursor = new Date(startDate);
  for (const entry of sequence) {
    const key = dateKey(cursor);
    dayMap.set(key, entry);
    cursor.setDate(cursor.getDate() + 1);
  }

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + sequence.length - 1);

  // Determine the range of months to display
  const firstMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  const months: { year: number; month: number; weeks: CalendarDay[][] }[] = [];

  const monthCursor = new Date(firstMonth);
  while (monthCursor <= lastMonth) {
    const y = monthCursor.getFullYear();
    const m = monthCursor.getMonth();
    months.push({
      year: y,
      month: m,
      weeks: buildMonthWeeks(y, m, startDayOffset, dayMap, startDate, endDate),
    });
    monthCursor.setMonth(monthCursor.getMonth() + 1);
  }

  return { months };
}

function buildMonthWeeks(
  year: number,
  month: number,
  startDayOffset: StartDay,
  dayMap: Map<string, { day: ProgramDay; blockLabel?: string; weekLabel?: string }>,
  rangeStart: Date,
  rangeEnd: Date
): CalendarDay[][] {
  const weeks: CalendarDay[][] = [];

  // First day of month
  const first = new Date(year, month, 1);
  // JS getDay(): 0=Sun…6=Sat — matches our offset system directly
  const jsDay = first.getDay();
  const offset = (jsDay - startDayOffset + 7) % 7;

  // Start of the first displayed week
  const gridStart = new Date(first);
  gridStart.setDate(gridStart.getDate() - offset);

  const gridCursor = new Date(gridStart);
  let safety = 0;

  while (safety++ < 6) {
    const week: CalendarDay[] = [];
    for (let d = 0; d < 7; d++) {
      const key = dateKey(gridCursor);
      const entry = dayMap.get(key);
      const inMonth = gridCursor.getMonth() === month;
      const inRange =
        gridCursor >= rangeStart && gridCursor <= rangeEnd && inMonth;

      week.push({
        date: new Date(gridCursor),
        programDay: inMonth ? entry?.day : undefined,
        blockLabel: inMonth ? entry?.blockLabel : undefined,
        weekLabel: inMonth ? entry?.weekLabel : undefined,
        inRange: inRange && !!entry,
      });

      gridCursor.setDate(gridCursor.getDate() + 1);
    }

    // Only include the week if at least one day is in the current month
    if (week.some((d) => d.date.getMonth() === month)) {
      weeks.push(week);
    }
  }

  return weeks;
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Day-type color helpers
// ---------------------------------------------------------------------------

function dayTypeClasses(day?: ProgramDay): string {
  if (!day) return "";
  switch (day.type) {
    case "workout":
      return "bg-primary/15 border-primary/30 text-primary";
    case "rest":
      return "bg-muted/60 border-muted-foreground/20 text-muted-foreground";
    case "active_rest":
      return "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400";
    default:
      return "bg-muted/40 border-border text-muted-foreground";
  }
}

function dayTypeDot(day?: ProgramDay): string {
  if (!day) return "";
  switch (day.type) {
    case "workout":
      return "bg-primary";
    case "rest":
      return "bg-muted-foreground/40";
    case "active_rest":
      return "bg-emerald-500";
    default:
      return "bg-muted-foreground/30";
  }
}

// ---------------------------------------------------------------------------
// Block / week color palette
// ---------------------------------------------------------------------------

const BLOCK_PALETTE = [
  { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", dot: "bg-sky-500" },
  { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", dot: "bg-violet-500" },
  { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", dot: "bg-rose-500" },
  { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", dot: "bg-indigo-500" },
];

function getBlockWeekClasses(program: Program, blockLabel?: string, weekLabel?: string) {
  if (!blockLabel) return null;
  const blocks = program.blocks ?? [];
  const bIdx = blocks.findIndex((b) => b.name === blockLabel);
  const blockIndex = bIdx >= 0 ? bIdx : 0;
  const block = blocks[blockIndex];

  // determine week index within block if possible
  let wIdx = 0;
  if (block && block.weeks?.length && weekLabel) {
    wIdx = block.weeks.findIndex(
      (w) => (w.label ?? `W${w.weekNumber}`) === weekLabel
    );
    if (wIdx < 0) wIdx = 0;
  }

  const pick = BLOCK_PALETTE[(blockIndex + wIdx) % BLOCK_PALETTE.length];
  return `${pick.bg} ${pick.border} ${pick.text}`;
}

function getBlockDotClass(program: Program, blockLabel?: string, weekLabel?: string) {
  if (!blockLabel) return "";
  const blocks = program.blocks ?? [];
  const bIdx = blocks.findIndex((b) => b.name === blockLabel);
  const blockIndex = bIdx >= 0 ? bIdx : 0;
  let wIdx = 0;
  const block = blocks[blockIndex];
  if (block && block.weeks?.length && weekLabel) {
    wIdx = block.weeks.findIndex(
      (w) => (w.label ?? `W${w.weekNumber}`) === weekLabel
    );
    if (wIdx < 0) wIdx = 0;
  }
  const pick = BLOCK_PALETTE[(blockIndex + wIdx) % BLOCK_PALETTE.length];
  return pick.dot;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ProgramCalendarDialogProps {
  program: Program;
  triggerContent?: ReactNode;
  triggerClassName?: string;
}

export function ProgramCalendarDialog({ program, triggerContent, triggerClassName }: ProgramCalendarDialogProps) {
  const [open, setOpen] = useState(false);
  // Calendar grid always starts on Sunday
  const GRID_START_DAY: StartDay = 0;
  // Program start day — the weekday the program begins on
  const [programStartDay, setProgramStartDay] = useState<StartDay>(1);
  // Compute start date: next upcoming occurrence of programStartDay (or today if it matches)
  const startDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = today.getDay();
    const daysUntil = (programStartDay - day + 7) % 7;
    const next = new Date(today);
    next.setDate(next.getDate() + (daysUntil === 0 ? 0 : daysUntil));
    return next;
  }, [programStartDay]);

  const [monthOffset, setMonthOffset] = useState(0);

  // Column headers are always Sun–Sat
  const orderedDayNames = DAY_NAMES_FULL;

  const calendarData = useMemo(
    () => buildCalendarGrid(program, startDate, GRID_START_DAY),
    [program, startDate, GRID_START_DAY]
  );

  const totalMonths = calendarData.months.length;
  const currentMonth = calendarData.months[monthOffset];

  const sequence = useMemo(() => flattenProgram(program), [program]);
  const totalDays = sequence.length;
  const workoutDays = sequence.filter((s) => s.day.type === "workout").length;
  const restDays = totalDays - workoutDays;

  if (totalDays === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(triggerClassName ?? "w-full gap-2", "inline-flex items-center justify-center")}
        >
          {triggerContent ?? (
            <>
              <CalendarDays className="h-4 w-4" />
              Calendar View
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Program Calendar
          </DialogTitle>
          <DialogDescription>
            Preview how your training cycle maps onto a real calendar. Pick the day you want to start and your program will repeat in order from there.
          </DialogDescription>
        </DialogHeader>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Start-day selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Program starts on
            </span>
            <Select
              value={String(programStartDay)}
              onValueChange={(v) => {
                setProgramStartDay(Number(v) as StartDay);
                setMonthOffset(0);
              }}
            >
              <SelectTrigger className="w-36 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {START_DAY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 ml-auto text-xs text-muted-foreground">
            <span>{totalDays} days total</span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              {workoutDays} workout
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/40" />
              {restDays} rest
            </span>
          </div>
        </div>

        {/* Month navigation */}
        {totalMonths > 0 && (
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={monthOffset <= 0}
              onClick={() => setMonthOffset((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold">
              {currentMonth
                ? `${MONTH_NAMES[currentMonth.month]} ${currentMonth.year}`
                : "—"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={monthOffset >= totalMonths - 1}
              onClick={() =>
                setMonthOffset((p) => Math.min(totalMonths - 1, p + 1))
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Calendar grid */}
        <ScrollArea className="flex-1 -mx-6 px-6">
          {currentMonth && (
            <div className="select-none">
              {/* Day name headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {orderedDayNames.map((name) => (
                  <div
                    key={name}
                    className="text-center text-xs font-medium text-muted-foreground py-1"
                  >
                    {name.slice(0, 3)}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              <div className="grid gap-1">
                {currentMonth.weeks.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 gap-1">
                    {week.map((cell, di) => {
                      const isCurrentMonth =
                        cell.date.getMonth() === currentMonth.month;

                          const blockClasses =
                            isCurrentMonth && cell.inRange && cell.blockLabel
                              ? getBlockWeekClasses(program, cell.blockLabel, cell.weekLabel)
                              : null;

                          return (
                            <div
                              key={di}
                              className={cn(
                                "relative rounded-md border p-1.5 min-h-[72px] transition-colors",
                                isCurrentMonth
                                  ? blockClasses
                                    ? blockClasses
                                    : cell.inRange
                                    ? dayTypeClasses(cell.programDay)
                                    : "bg-background border-border/50"
                                  : "bg-transparent border-transparent opacity-30"
                              )}
                            >
                          {/* Date number */}
                          <div
                            className={cn(
                              "text-[11px] font-medium leading-none",
                              !isCurrentMonth && "text-muted-foreground/50"
                            )}
                          >
                            {cell.date.getDate()}
                          </div>

                          {/* Program day content */}
                          {cell.programDay && isCurrentMonth && (
                            <div className="mt-1 space-y-0.5">
                              {/* Block / week label */}
                              {cell.blockLabel && (
                                <div className="text-[9px] font-medium leading-tight opacity-70 truncate">
                                  {cell.blockLabel} · {cell.weekLabel}
                                </div>
                              )}
                              {/* Day name + dot */}
                              <div className="flex items-center gap-1">
                                <span
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full shrink-0",
                                    cell.blockLabel
                                      ? getBlockDotClass(
                                          program,
                                          cell.blockLabel,
                                          cell.weekLabel
                                        )
                                      : dayTypeDot(cell.programDay)
                                  )}
                                />
                                <span className="text-[10px] font-medium leading-tight truncate">
                                  {cell.programDay.name}
                                </span>
                              </div>
                              {/* Exercise count for workout days */}
                              {cell.programDay.type === "workout" && (
                                <div className="text-[9px] opacity-60 leading-tight">
                                  {cell.programDay.groups?.flatMap(
                                    (g) => g.exercises
                                  ).length ?? 0}{" "}
                                  exercises
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
