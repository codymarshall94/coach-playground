import { IntensitySystem, SetInfo } from "@/types/Workout";
import { setIntensityDefaults } from "./sets";

export function switchExerciseIntensity(
  sets: SetInfo[],
  next: IntensitySystem
): SetInfo[] {
  return setIntensityDefaults(sets, next);
}

export function rpeToPercent(rpe: number): number {
  const clamped = Math.min(10, Math.max(6, rpe));
  return Math.round(100 - (10 - clamped) * 5); // 10 RPE ≈100%, 6 ≈80%
}

export function percentToRpe(percent: number): number {
  const p = Math.min(100, Math.max(60, percent));
  return Math.round(10 - (100 - p) / 5);
}
