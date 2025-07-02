import { useQuery } from "@tanstack/react-query";
import { getAllExercises } from "@/services/exerciseService";
import { Exercise } from "@/types/Exercise";

export function useExercises() {
  console.log("🧠 useExercises");
  return useQuery<Exercise[]>({
    queryKey: ["exercises"],
    queryFn: getAllExercises,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
