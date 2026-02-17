import { IntensitySystem, SetInfo } from "@/types/Workout";

export function setIntensityDefaults(
  sets: SetInfo[],
  mode: IntensitySystem
): SetInfo[] {
  return sets.map((s) => ({
    ...s,
    rpe: mode === "rpe" ? s.rpe ?? 8 : null,
    one_rep_max_percent:
      mode === "one_rep_max_percent" ? s.one_rep_max_percent ?? 70 : null,
    rir: mode === "rir" ? s.rir ?? 2 : null,
  }));
}

export function reindexSets(sets: SetInfo[]): SetInfo[] {
  return sets;
}

export function collapseIdenticalSets(sets: SetInfo[]) {
  const sig = (s: SetInfo) =>
    `${s.reps ?? ""}|${s.rpe ?? ""}|${s.one_rep_max_percent ?? ""}|${
      s.rir ?? ""
    }|${s.rest ?? ""}`;
  const out: Array<SetInfo & { count: number }> = [];
  for (const s of sets) {
    const last = out[out.length - 1];
    if (last && sig(last) === sig(s)) {
      last.count += 1;
    } else {
      out.push({ ...s, count: 1 });
    }
  }
  return out;
}
