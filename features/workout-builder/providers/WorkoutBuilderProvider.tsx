"use client";

import { useWorkoutBuilder } from "@/hooks/useWorkoutBuilder";
import { Program } from "@/types/Workout";
import { createContext, useContext } from "react";

const WorkoutBuilderContext = createContext<ReturnType<
  typeof useWorkoutBuilder
> | null>(null);

export const WorkoutBuilderProvider = ({
  initialProgram,
  children,
}: {
  initialProgram?: Program;
  children: React.ReactNode;
}) => {
  const value = useWorkoutBuilder(initialProgram);
  return (
    <WorkoutBuilderContext.Provider value={value}>
      {children}
    </WorkoutBuilderContext.Provider>
  );
};

export const useWorkoutBuilderContext = () => {
  const ctx = useContext(WorkoutBuilderContext);
  if (!ctx)
    throw new Error(
      "useWorkoutBuilderContext must be used within WorkoutBuilderProvider"
    );
  return ctx;
};
