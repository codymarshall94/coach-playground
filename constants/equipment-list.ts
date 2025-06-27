import { Equipment } from "@/types/Workout";

export const EQUIPMENT_LIST: Equipment[] = [
  "barbell",
  "rack",
  "bench",
  "box",
  "pause",
  "bar",
  "kettlebell",
  "cable",
  "dumbbell",
  "machine",
  "bodyweight",
  "other",
];

export const EQUIPMENT_DISPLAY_MAP: Record<Equipment, string> = {
  barbell: "Barbell",
  rack: "Rack",
  bench: "Bench",
  box: "Box",
  pause: "Paused",
  bar: "Bar",
  kettlebell: "Kettlebell",
  cable: "Cable",
  dumbbell: "Dumbbell",
  machine: "Machine",
  bodyweight: "Bodyweight",
  other: "Other",
};
