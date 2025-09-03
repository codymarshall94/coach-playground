import { SetInfo, SetType } from "@/types/Workout";

export const addSet = (sets: SetInfo[]) => {
  const lastSet = sets[sets.length - 1];
  const newSet = {
    reps: lastSet?.reps || 8,
    rest: lastSet?.rest || 90,
    rpe: lastSet?.rpe || null,
    rir: lastSet?.rir || null,
    one_rep_max_percent: lastSet?.one_rep_max_percent || null,
    set_type: "standard" as SetType,
  };
  return [...sets, newSet];
};

export const removeSet = (sets: SetInfo[], index: number) => {
  return sets.filter((_, i) => i !== index);
};

export const updateSet = (sets: SetInfo[], index: number, set: SetInfo) => {
  return sets.map((s, i) => (i === index ? set : s));
};

export const duplicateSet = (sets: SetInfo[], index: number) => {
  const setToDuplicate = sets[index];
  const newSet = { ...setToDuplicate };
  const updated = [...sets];
  updated.splice(index + 1, 0, newSet);
  return updated;
};
