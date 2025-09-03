"use client";

import { MUSCLES, MuscleGroup } from "@/constants/muscles";
import {
  buildGroupedByCategory,
  exerciseMatchesFiltersAndSearch,
  rankAndSort,
  tokenize,
} from "@/features/workout-builder/utils/exercises";
import { useExercises } from "@/hooks/useExercises";
import type { Equipment, SkillRequirement } from "@/types/Exercise";
import { useCallback, useEffect, useMemo, useState } from "react";

export type SortKey =
  | "relevance"
  | "alpha"
  | "fatigue_asc"
  | "fatigue_desc"
  | "cns_desc"
  | "metabolic_desc"
  | "joint_desc";

function useDebounced<T>(val: T, ms = 200) {
  const [v, setV] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setV(val), ms);
    return () => clearTimeout(t);
  }, [val, ms]);
  return v;
}

export function useExerciseLibrary() {
  const { data: all = [], isLoading, error } = useExercises();

  const [search, setSearch] = useState("");
  const debouncedQuery = useDebounced(search, 200);
  const tokens = useMemo(() => tokenize(debouncedQuery), [debouncedQuery]);

  const [sortKey, setSortKey] = useState<SortKey>("relevance");

  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]); // "compound" | "unilateral" | "ballistic"
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillRequirement | "">("");

  const [maxFatigue, setMaxFatigue] = useState<number | null>(null);
  const [maxCNS, setMaxCNS] = useState<number | null>(null);
  const [maxMetabolic, setMaxMetabolic] = useState<number | null>(null);
  const [maxJointStress, setMaxJointStress] = useState<number | null>(null);

  const toggleCategory = useCallback((cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const toggleEquipment = useCallback((eq: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(eq as Equipment)
        ? (prev.filter((e) => e !== (eq as Equipment)) as Equipment[])
        : ([...prev, eq] as Equipment[])
    );
  }, []);

  const toggleTrait = useCallback((tag: string) => {
    setSelectedTraits((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  /**
   * Toggle muscles by id OR whole muscle group name (as your UI does).
   * - If a group name is provided, toggles the whole group (all-or-none).
   * - If an id is provided, toggles that single muscle id.
   */
  const toggleMuscle = useCallback((idOrGroup: string) => {
    // group?
    const groupIds = MUSCLES.filter(
      (m) => m.group === (idOrGroup as MuscleGroup)
    ).map((m) => m.id);

    if (groupIds.length > 0) {
      setSelectedMuscles((prev) => {
        const allIn = groupIds.every((id) => prev.includes(id));
        if (allIn) {
          // clear all of this group
          return prev.filter((id) => !groupIds.includes(id));
        }
        // add all missing from this group
        const set = new Set(prev);
        groupIds.forEach((id) => set.add(id));
        return Array.from(set);
      });
      return;
    }

    // id
    setSelectedMuscles((prev) =>
      prev.includes(idOrGroup)
        ? prev.filter((id) => id !== idOrGroup)
        : [...prev, idOrGroup]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setActiveCategories([]);
    setSelectedMuscles([]);
    setSelectedTraits([]);
    setSelectedEquipment([]);
    setSelectedSkill("");
    setMaxFatigue(null);
    setMaxCNS(null);
    setMaxMetabolic(null);
    setMaxJointStress(null);
  }, []);

  const filtered = useMemo(() => {
    const base = all.filter((e) =>
      exerciseMatchesFiltersAndSearch(e, {
        categories: activeCategories,
        muscleIds: selectedMuscles,
        traits: selectedTraits as Array<
          "compound" | "unilateral" | "ballistic"
        >,
        equipment: selectedEquipment,
        skill: selectedSkill || undefined,
        limits: {
          fatigue: maxFatigue,
          cns: maxCNS,
          metabolic: maxMetabolic,
          joint: maxJointStress,
        },
        tokens,
      })
    );

    return rankAndSort(base, sortKey, tokens);
  }, [
    all,
    activeCategories,
    selectedMuscles,
    selectedTraits,
    selectedEquipment,
    selectedSkill,
    maxFatigue,
    maxCNS,
    maxMetabolic,
    maxJointStress,
    sortKey,
    tokens,
  ]);

  const grouped = useMemo(() => buildGroupedByCategory(filtered), [filtered]);

  return {
    isLoading,
    error,

    filtered,
    grouped,

    search,
    setSearch,
    sortKey,
    setSortKey,

    activeCategories,
    toggleCategory,

    selectedMuscles,
    toggleMuscle,

    selectedTraits,
    toggleTrait,

    selectedEquipment,
    toggleEquipment,

    selectedSkill,
    setSelectedSkill,

    maxFatigue,
    setMaxFatigue,
    maxCNS,
    setMaxCNS,
    maxMetabolic,
    setMaxMetabolic,
    maxJointStress,
    setMaxJointStress,

    resetFilters,
  };
}
