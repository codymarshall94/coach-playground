import { MUSCLES } from "@/constants/muscles";

export const MUSCLES_BY_GROUP: Record<string, string[]> = {};
MUSCLES.forEach((m) => {
  if (m.group) {
    if (!MUSCLES_BY_GROUP[m.group]) MUSCLES_BY_GROUP[m.group] = [];
    MUSCLES_BY_GROUP[m.group].push(m.id);
  }
});

export function isGroup(id: string) {
  return id in MUSCLES_BY_GROUP;
}

export function getGroupMuscles(group: string): string[] {
  return MUSCLES_BY_GROUP[group] ?? [];
}
