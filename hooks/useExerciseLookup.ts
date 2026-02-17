import type { Exercise } from "@/types/Exercise";
import { useMemo } from "react";

export function useExerciseLookup(exercises?: Exercise[]) {
  // Build a Map once and keep referential stability while `exercises` is unchanged
  const map = useMemo(() => {
    const m = new Map<string, Exercise>();
    (exercises ?? []).forEach((ex) => m.set(ex.id, ex));
    return m;
  }, [exercises]);

  // The scoring util expects: (id: string) => Exercise | undefined
  return useMemo(() => {
    const lookup = (id: string) => map.get(id);
    (lookup as any).size = map.size;
    (lookup as any).has = (id: string) => map.has(id);
    return lookup as (id: string) =>
      | Exercise
      | (undefined & {
          size?: number;
          has?: (id: string) => boolean;
        });
  }, [map]);
}
