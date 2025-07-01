import { useQuery } from "@tanstack/react-query";
import {
  getAllProgramsForUser,
  getProgramById,
} from "@/services/programService";

export function usePrograms() {
  return useQuery({
    queryKey: ["programs"],
    queryFn: getAllProgramsForUser,
  });
}

export function useProgram(id: string) {
  return useQuery({
    queryKey: ["program", id],
    queryFn: () => getProgramById(id),
    enabled: !!id,
  });
}
