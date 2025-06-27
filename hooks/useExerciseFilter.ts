import { EXERCISES } from "@/data/exercises";
import { Equipment, Exercise } from "@/types/Workout";
import { getMusclesFromSelection } from "@/utils/getMusclesFromSelection";
import { groupBy } from "@/utils/groupBy";
import { getGroupMuscles, isGroup } from "@/utils/muscleGroups";
import { useMemo, useState } from "react";

export function useExerciseFilter() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"recovery" | "fatigue" | "name">(
    "name"
  );
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [maxFatigue, setMaxFatigue] = useState<number | null>(null);
  const [maxCNS, setMaxCNS] = useState<number | null>(null);
  const [maxMetabolic, setMaxMetabolic] = useState<number | null>(null);
  const [maxJointStress, setMaxJointStress] = useState<number | null>(null);

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleMuscle = (id: string) => {
    setSelectedMuscles((prev) => {
      if (isGroup(id)) {
        const muscleIds = getGroupMuscles(id);
        const allSelected = muscleIds.every((m) => prev.includes(m));
        if (allSelected) {
          // Unselect the group and its muscles
          return prev.filter((m) => !muscleIds.includes(m) && m !== id);
        } else {
          // Select group and its muscles
          return Array.from(new Set([...prev, id, ...muscleIds]));
        }
      } else {
        // Toggle a single muscle
        return prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id];
      }
    });
  };
  const toggleTrait = (tag: string) => {
    setSelectedTraits((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleEquipment = (eq: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    );
  };
  const resetFilters = () => {
    setActiveCategories([]);
    setSelectedSkill("");
    setSelectedEquipment([]);
    setSelectedMuscles([]);
    setMaxFatigue(null);
    setMaxCNS(null);
    setMaxMetabolic(null);
    setMaxJointStress(null);
    setSearch("");
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

      const matchesEquipment =
        selectedEquipment.length === 0 ||
        selectedEquipment.some((eq) => ex.equipment.includes(eq as Equipment));

      const effectiveMuscles = getMusclesFromSelection(selectedMuscles);

      const matchesMuscle =
        effectiveMuscles.length === 0 ||
        effectiveMuscles.some((muscle) =>
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

  return {
    search,
    setSearch,
    sortKey,
    setSortKey,
    activeCategories,
    toggleCategory,
    selectedMuscles,
    toggleMuscle,
    selectedEquipment,
    toggleEquipment,
    selectedTraits,
    toggleTrait,
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
    filtered,
    grouped,
  };
}
