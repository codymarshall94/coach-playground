import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export function useSortableSensors() {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6, // small drag threshold to avoid click-drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
}
