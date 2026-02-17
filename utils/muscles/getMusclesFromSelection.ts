import { getGroupMuscles, isGroup } from "@/utils/muscles/muscleGroups";

export function getMusclesFromSelection(selected: string[]): string[] {
  const result = new Set<string>();

  for (const id of selected) {
    if (isGroup(id)) {
      getGroupMuscles(id).forEach((muscle) => result.add(muscle));
    } else {
      result.add(id);
    }
  }

  return Array.from(result);
}
