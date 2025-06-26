"use client";

import { CATEGORY_DISPLAY_MAP } from "@/constants/movement-category";
import { EXERCISES } from "@/data/exercises";
import type { Exercise } from "@/types/Workout";
import { groupBy } from "@/utils/groupBy";
import { Dumbbell } from "lucide-react";
import { useMemo, useState } from "react";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export const ExerciseLibrary = ({
  addExercise,
}: {
  addExercise: (exercise: Exercise) => void;
}) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"recovery" | "fatigue" | "name">(
    "name"
  );

  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [maxFatigue, setMaxFatigue] = useState<number | null>(null);
  const [maxCNS, setMaxCNS] = useState<number | null>(null);
  const [maxMetabolic, setMaxMetabolic] = useState<number | null>(null);
  const [maxJointStress, setMaxJointStress] = useState<number | null>(null);

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle]
    );
  };

  const toggleTrait = (tag: string) => {
    setSelectedTraits((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(() => {
    return EXERCISES.filter((ex) => {
      const matchesSearch =
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.aliases.some((a) => a.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        activeCategories.length === 0 || activeCategories.includes(ex.category);

      const matchesSkill = selectedSkill
        ? ex.skillRequirement === selectedSkill
        : true;

      const matchesEquipment = selectedEquipment
        ? ex.equipment.some((e) =>
            e.toLowerCase().includes(selectedEquipment.toLowerCase())
          )
        : true;

      const matchesMuscle =
        selectedMuscles.length === 0 ||
        selectedMuscles.every((muscle) =>
          Object.keys(ex.activationMap).includes(muscle)
        );

      const matchesTraits =
        selectedTraits.length === 0 ||
        selectedTraits.every((trait) => ex[trait as keyof Exercise] === true);

      const matchesFatigue =
        maxFatigue === null || ex.fatigue.index <= maxFatigue;
      const matchesCNS = maxCNS === null || ex.fatigue.cnsDemand <= maxCNS;
      const matchesMetabolic =
        maxMetabolic === null || ex.fatigue.metabolicDemand <= maxMetabolic;
      const matchesJoint =
        maxJointStress === null || ex.fatigue.jointStress <= maxJointStress;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSkill &&
        matchesEquipment &&
        matchesMuscle &&
        matchesTraits &&
        matchesFatigue &&
        matchesCNS &&
        matchesMetabolic &&
        matchesJoint
      );
    }).sort((a, b) => {
      if (sortKey === "recovery") return a.recoveryDays - b.recoveryDays;
      if (sortKey === "fatigue") return b.fatigue.index - a.fatigue.index;
      return a.name.localeCompare(b.name);
    });
  }, [
    search,
    activeCategories,
    sortKey,
    selectedSkill,
    selectedEquipment,
    selectedMuscles,
    selectedTraits,
    maxFatigue,
    maxCNS,
    maxMetabolic,
    maxJointStress,
  ]);

  const grouped = groupBy(filtered, (ex) => ex.category);

  const resetFilters = () => {
    setActiveCategories([]);
    setSelectedSkill("");
    setSelectedEquipment("");
    setSelectedMuscles([]);
    setMaxFatigue(null);
    setMaxCNS(null);
    setMaxMetabolic(null);
    setMaxJointStress(null);
    setSearch("");
  };

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
            setEquipment={setSelectedEquipment}
            toggleMuscle={toggleMuscle}
            selectedTraits={selectedTraits}
            toggleTrait={toggleTrait}
            skill={selectedSkill}
            equipment={selectedEquipment}
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
