import { EXERCISES } from "@/data/exercises";
import { Exercise } from "@/types/Workout";
import { Dumbbell } from "lucide-react";
import { ExerciseCard } from "./ExerciseCard";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export const ExerciseLibrary = ({
  addExercise,
}: {
  addExercise: (exercise: Exercise) => void;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <Dumbbell className="w-4 h-4" /> Open Exercise Library
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full max-w-lg min-w-1/3 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-slate-900">
            Exercise Library
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-3 mt-6">
          {EXERCISES.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onAdd={() => addExercise(exercise)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
