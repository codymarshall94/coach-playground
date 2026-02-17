"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Filter, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ExerciseCard } from "./ExerciseCard";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  EQUIPMENT_DISPLAY_MAP,
  EQUIPMENT_LIST,
} from "@/constants/equipment-list";
import { CATEGORY_DISPLAY_MAP } from "@/constants/movement-category";
import { MUSCLES } from "@/constants/muscles";
import type { Equipment, Exercise } from "@/types/Exercise";

type Props = {
  exercises: Exercise[];
  onAdd: (exercise: Exercise) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

type Filters = {
  query: string;
  muscle: string | null;
  category: string | null;
  equipment: string | null;
  sort: "relevance" | "a-z";
};

const INITIAL: Filters = {
  query: "",
  muscle: null,
  category: null,
  equipment: null,
  sort: "relevance",
};

const normalize = (s: string) => s.toLowerCase();

function relevanceScore(ex: Exercise, q: string) {
  if (!q) return 0;
  const n = normalize(q);
  let s = 0;
  if (normalize(ex.name).includes(n)) s += 3;
  if (normalize(ex.category ?? "").includes(n)) s += 1;
  if (ex.equipment?.some((e) => normalize(e).includes(n))) s += 1;
  if (
    ex.exercise_muscles?.some((m) =>
      normalize(m.muscles.display_name).includes(n)
    )
  )
    s += 1.5;
  return -s;
}

export function ExerciseLibrary({ open, setOpen, exercises, onAdd }: Props) {
  const [f, setF] = useState<Filters>(INITIAL);

  const list = useMemo(() => {
    let L = exercises;

    if (f.query) {
      const q = normalize(f.query);
      L = L.filter((ex) => {
        const n = normalize(ex.name).includes(q);
        const c = normalize(ex.category ?? "").includes(q);
        const e = ex.equipment?.some((e) => normalize(e).includes(q));
        const m = ex.exercise_muscles?.some((m) =>
          normalize(m.muscles.display_name).includes(q)
        );
        return n || c || e || m;
      });
    }
    if (f.muscle) {
      L = L.filter((ex) =>
        ex.exercise_muscles?.some((m) => m.muscles.display_name === f.muscle)
      );
    }
    if (f.category) {
      L = L.filter((ex) => ex.category === f.category);
    }
    if (f.equipment) {
      L = L.filter((ex) => ex.equipment?.includes(f.equipment as Equipment));
    }

    if (f.sort === "a-z") {
      L = [...L].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      L = [...L].sort(
        (a, b) => relevanceScore(a, f.query) - relevanceScore(b, f.query)
      );
    }
    return L;
  }, [exercises, f]);

  const clearKey = (k: keyof Filters) =>
    setF((prev) => ({ ...prev, [k]: (INITIAL as any)[k] }));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => setOpen(true)}>
          Exercise Library
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="p-0 min-w-[500px] h-full flex flex-col"
      >
        <div className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <div className="flex items-center justify-between px-4 pt-3">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold text-foreground">
                Exercise Library
              </SheetTitle>
              <SheetDescription>{list.length} exercises found</SheetDescription>
            </SheetHeader>
          </div>

          <div className="px-4 pb-3">
            <div className="flex flex-col items-center gap-2">
              <Input
                value={f.query}
                onChange={(e) => setF((s) => ({ ...s, query: e.target.value }))}
                placeholder="Search (name, muscle, equipment)…"
                className="h-9"
              />
              <Separator orientation="vertical" className="mx-1 h-6" />
              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  value={f.muscle ?? ""}
                  onValueChange={(value) =>
                    setF((s) => ({ ...s, muscle: value || null }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Muscle" />
                  </SelectTrigger>
                  <SelectContent className="z-[1000]">
                    {MUSCLES.map((m) => (
                      <SelectItem key={m.id} value={m.displayName}>
                        {m.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={f.category ?? ""}
                  onValueChange={(value) =>
                    setF((s) => ({ ...s, category: value || null }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="z-[1000]">
                    {Object.keys(CATEGORY_DISPLAY_MAP).map((c) => (
                      <SelectItem key={c} value={c}>
                        {
                          CATEGORY_DISPLAY_MAP[
                            c as keyof typeof CATEGORY_DISPLAY_MAP
                          ]
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={f.equipment ?? ""}
                  onValueChange={(value) =>
                    setF((s) => ({ ...s, equipment: value || null }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Equipment" />
                  </SelectTrigger>
                  <SelectContent className="z-[1000]">
                    {EQUIPMENT_LIST.map((e) => (
                      <SelectItem key={e} value={e}>
                        {EQUIPMENT_DISPLAY_MAP[
                          e as keyof typeof EQUIPMENT_DISPLAY_MAP
                        ] ?? e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={f.sort}
                  onValueChange={(value) =>
                    setF((s) => ({ ...s, sort: value as Filters["sort"] }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="z-[1000]">
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="a-z">A–Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {(
                [
                  ["muscle", f.muscle],
                  ["category", f.category],
                  ["equipment", f.equipment],
                ] as const
              )
                .filter(([, v]) => !!v)
                .map(([k, v]) => (
                  <Badge key={k} variant="secondary" className="rounded-full">
                    <Filter className="mr-1 h-3.5 w-3.5" />
                    {String(v)}
                    <button
                      className="ml-1 inline-flex"
                      onClick={() => clearKey(k)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}

              {(f.query || f.muscle || f.category || f.equipment) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-8"
                  onClick={() => setF(INITIAL)}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        <ScrollArea className="w-full h-full flex-1 px-4 ">
          <div className="space-y-2 py-3">
            {list.length === 0 ? (
              <EmptyState />
            ) : (
              list.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} onAdd={onAdd} />
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto mt-12 max-w-sm rounded-2xl border bg-card/50 p-6 text-center">
      <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-muted" />
      <h3 className="mb-1 text-sm font-semibold">No exercises found</h3>
      <p className="text-xs text-muted-foreground">
        Try removing a filter or searching a broader term (e.g., “press”).
      </p>
    </div>
  );
}
