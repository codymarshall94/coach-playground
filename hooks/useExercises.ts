import { useQuery } from "@tanstack/react-query";
import { getAllExercises } from "@/services/exerciseService";
import type { Exercise } from "@/types/Exercise";

export function useExercises() {
  return useQuery<Exercise[]>({
    queryKey: ["exercises"],
    queryFn: getAllExercises,
    staleTime: 1000 * 60 * 5,
  });
}
