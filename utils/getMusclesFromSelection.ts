import { MUSCLES } from "@/constants/muscles";

const MUSCLES_BY_GROUP: Record<string, string[]> = {};

MUSCLES.forEach((m) => {
  if (!m.group) return;
  if (!MUSCLES_BY_GROUP[m.group]) MUSCLES_BY_GROUP[m.group] = [];
  MUSCLES_BY_GROUP[m.group].push(m.id);
});

export function getMusclesFromSelection(selected: string[]): string[] {
  const result = new Set<string>();

  for (const id of selected) {
    if (MUSCLES_BY_GROUP[id]) {
      MUSCLES_BY_GROUP[id].forEach((muscle) => result.add(muscle));
    } else {
      result.add(id);
    }
  }

  return Array.from(result);
}
