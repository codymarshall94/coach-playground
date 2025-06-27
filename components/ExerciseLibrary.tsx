"use client";

import { CATEGORY_DISPLAY_MAP } from "@/constants/movement-category";
import { useExerciseFilter } from "@/hooks/useExerciseFilter";
import type { Exercise } from "@/types/Workout";
import { Dumbbell } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { ExerciseCard } from "./ExerciseCard";
import { FilterPopover } from "./FilterPopover";
import { SortPopover } from "./SortPopover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export const ExerciseLibrary = ({
  addExercise,
}: {
  addExercise: (exercise: Exercise) => void;
}) => {
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
  } = useExerciseFilter();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="gap-2 ">
          <Dumbbell className="w-4 h-4" /> Exercise Library
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-lg min-w-1/3 p-4">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-slate-900">
            Exercise Library
          </SheetTitle>
          <SheetDescription>{filtered.length} exercises found</SheetDescription>
        </SheetHeader>

        <div className="sticky top-0 z-10 bg-white flex items-center justify-between  gap-2">
          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

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

        <ScrollArea className="mt-4 h-[calc(100vh-200px)] pr-2">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Dumbbell className="w-8 h-8" />}
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
              {Object.entries(grouped).map(([category, list]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-600 uppercase">
                    {CATEGORY_DISPLAY_MAP[category] ?? category}
                  </h4>
                  <div className="space-y-2">
                    {list.map((exercise) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onAdd={() => addExercise(exercise)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
