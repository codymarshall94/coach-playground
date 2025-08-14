"use client";

import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CATEGORY_DISPLAY_MAP } from "@/constants/movement-category";
import { ExerciseCard } from "@/features/workout-builder/components/exercises/ExerciseCard";
import { FilterPopover } from "@/features/workout-builder/components/exercises/FilterPopover";
import { SortPopover } from "@/features/workout-builder/components/exercises/SortPopover";
import { useExerciseFilter } from "@/hooks/useExerciseFilter";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/types/Exercise";
import { ChevronDown, Library } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type ExerciseLibraryProps = {
  addExercise: (exercise: Exercise) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  groupIndex?: number;
  addToGroup?: (groupIndex: number, exercise: Exercise) => void;
};

export const ExerciseLibrary = ({
  addExercise,
  open,
  setOpen,
  groupIndex,
  addToGroup,
}: ExerciseLibraryProps) => {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const {
    filtered,
    search,
    setSearch,
    activeCategories,
    toggleCategory,
    selectedMuscles,
    setSelectedSkill,
    selectedEquipment,
    toggleEquipment,
    toggleMuscle,
    selectedTraits,
    toggleTrait,
    selectedSkill,
    maxFatigue,
    setMaxFatigue,
    maxCNS,
    setMaxCNS,
    maxMetabolic,
    setMaxMetabolic,
    maxJointStress,
    setMaxJointStress,
    resetFilters,
    sortKey,
    setSortKey,
    grouped,
    isLoading,
  } = useExerciseFilter();

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];

    if (activeCategories.length) {
      chips.push({
        key: "categories",
        label: activeCategories
          .map((c) => CATEGORY_DISPLAY_MAP[c] ?? c)
          .join(", "),
        onRemove: () => activeCategories.forEach((c) => toggleCategory(c)),
      });
    }
    if (selectedMuscles.length) {
      chips.push({
        key: "muscles",
        label: selectedMuscles.join(", "),
        onRemove: () => selectedMuscles.forEach((id) => toggleMuscle(id)),
      });
    }
    if (selectedTraits.length) {
      chips.push({
        key: "traits",
        label: selectedTraits.join(", "),
        onRemove: () => selectedTraits.forEach((t) => toggleTrait(t)),
      });
    }
    if (selectedEquipment.length) {
      chips.push({
        key: "equipment",
        label: selectedEquipment.join(", "),
        onRemove: () => selectedEquipment.forEach((e) => toggleEquipment(e)),
      });
    }
    if (selectedSkill) {
      chips.push({
        key: "skill",
        label:
          selectedSkill === "low"
            ? "Beginner"
            : selectedSkill === "moderate"
            ? "Intermediate"
            : "Advanced",
        onRemove: () => setSelectedSkill(""),
      });
    }
    const limitParts: string[] = [];
    if (maxFatigue !== null && maxFatigue < 1)
      limitParts.push(`Fatigue ≤ ${maxFatigue.toFixed(1)}`);
    if (maxCNS !== null && maxCNS < 1)
      limitParts.push(`CNS ≤ ${maxCNS.toFixed(1)}`);
    if (maxMetabolic !== null && maxMetabolic < 1)
      limitParts.push(`Metabolic ≤ ${maxMetabolic.toFixed(1)}`);
    if (maxJointStress !== null && maxJointStress < 1)
      limitParts.push(`Joint ≤ ${maxJointStress.toFixed(1)}`);
    if (limitParts.length) {
      chips.push({
        key: "limits",
        label: limitParts.join(" · "),
        onRemove: () => {
          setMaxFatigue(null);
          setMaxCNS(null);
          setMaxMetabolic(null);
          setMaxJointStress(null);
        },
      });
    }
    return chips;
  }, [
    activeCategories,
    selectedMuscles,
    selectedTraits,
    selectedEquipment,
    selectedSkill,
    maxFatigue,
    maxCNS,
    maxMetabolic,
    maxJointStress,
  ]);

  const expandAll = () =>
    setOpenMap((m) => Object.fromEntries(Object.keys(m).map((k) => [k, true])));
  const collapseAll = () =>
    setOpenMap((m) =>
      Object.fromEntries(Object.keys(m).map((k) => [k, false]))
    );

  useEffect(() => {
    if (search.length > 0) expandAll();
    else collapseAll();
  }, [search]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Library className="h-4 w-4 mr-2" />
          Exercise Library
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-lg min-w-1/3 p-2">
        <div className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
          <SheetHeader className="">
            <SheetTitle className="text-xl font-bold text-foreground">
              Exercise Library
            </SheetTitle>
            <SheetDescription>
              {filtered?.length ?? 0} exercises found
            </SheetDescription>
          </SheetHeader>
          <div className="pb-6">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search exercises… "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-3"
                />
              </div>
              <FilterPopover
                categories={Object.keys(CATEGORY_DISPLAY_MAP)}
                activeCategories={activeCategories}
                toggleCategory={toggleCategory}
                selectedMuscles={selectedMuscles}
                setSkill={setSelectedSkill}
                selectedEquipment={selectedEquipment}
                toggleEquipment={toggleEquipment}
                toggleMuscle={toggleMuscle}
                selectedTraits={selectedTraits}
                toggleTrait={toggleTrait}
                skill={selectedSkill}
                maxFatigue={maxFatigue}
                setMaxFatigue={setMaxFatigue}
                maxCNS={maxCNS}
                setMaxCNS={setMaxCNS}
                maxMetabolic={maxMetabolic}
                setMaxMetabolic={setMaxMetabolic}
                maxJointStress={maxJointStress}
                setMaxJointStress={setMaxJointStress}
                clearFilters={resetFilters}
              />

              <SortPopover sortKey={sortKey} setSortKey={setSortKey} />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {activeChips.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={resetFilters}
                >
                  Clear all
                </Button>
              )}
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={chip.onRemove}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[11px] bg-secondary border border-border/60"
                >
                  {chip.label} ✕
                </button>
              ))}
            </div>
            <div
              className={cn(
                "mt-2 flex items-center gap-2",
                search.length > 0 && "hidden"
              )}
            >
              <Button variant="outline" size="sm" onClick={expandAll}>
                Expand all
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Collapse all
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="mt-4 h-[calc(100vh-200px)] pr-2">
          {filtered?.length === 0 && !isLoading ? (
            <EmptyState
              image={
                <Image
                  src="/images/empty-states/no-exercises.png"
                  alt="No Exercises Added"
                  width={300}
                  height={300}
                />
              }
              title="No exercises found"
              description="Try adjusting your filters or search terms to find matching exercises."
              action={
                <Button onClick={resetFilters} variant="outline">
                  Clear Search
                </Button>
              }
            />
          ) : (
            <div className="space-y-6">
              {search.length > 0 ? (
                <div className="space-y-2">
                  {filtered?.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      onAdd={(exercise) => {
                        if (groupIndex !== undefined && addToGroup) {
                          addToGroup(groupIndex, exercise);
                        } else {
                          addExercise(exercise);
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <>
                  {Object.entries(grouped).map(([category, list]) => (
                    <Collapsible
                      key={category}
                      className="space-y-2"
                      open={openMap[category]}
                      onOpenChange={() =>
                        setOpenMap((m) => ({ ...m, [category]: !m[category] }))
                      }
                    >
                      <CollapsibleTrigger
                        className={cn(
                          "cursor-pointer text-sm w-full py-2 px-1 rounded font-semibold text-muted-foreground uppercase flex items-center justify-between",
                          openMap[category] &&
                            "bg-primary text-primary-foreground "
                        )}
                      >
                        {CATEGORY_DISPLAY_MAP[category] ?? category}
                        <ChevronDown
                          className={cn(
                            "ml-2 w-4 h-4 transition-transform",
                            openMap[category] && "-rotate-180"
                          )}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2">
                        {list.map((exercise) => (
                          <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                            onAdd={(exercise) => {
                              if (groupIndex !== undefined && addToGroup) {
                                addToGroup(groupIndex, exercise);
                              } else {
                                addExercise(exercise);
                              }
                            }}
                          />
                        ))}
                      </CollapsibleContent>
                      <Separator />
                    </Collapsible>
                  ))}
                </>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
