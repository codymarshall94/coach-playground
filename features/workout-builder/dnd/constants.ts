import type { DropAnimation, Modifier } from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

export const DEFAULT_DROP_ANIMATION: DropAnimation = {
  duration: 300,
  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
};

export const VERTICAL_LIST_MODIFIERS: Modifier[] = [
  restrictToVerticalAxis,
  restrictToWindowEdges,
];

export const OVERLAY_MOTION = {
  initial: { scale: 1, opacity: 1 },
  animate: { scale: 1.05, opacity: 0.95 },
  exit: { scale: 0.98, opacity: 0.85 },
  transition: { duration: 0.2, ease: "easeOut" },
} as const;
