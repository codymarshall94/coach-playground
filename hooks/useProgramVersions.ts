import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProgramVersions,
  restoreProgramVersion,
  type ProgramVersion,
} from "@/services/programService";

export function useProgramVersions(programId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery<ProgramVersion[]>({
    queryKey: ["program-versions", programId],
    queryFn: () => getProgramVersions(programId!),
    enabled: !!programId,
  });

  const restoreMutation = useMutation({
    mutationFn: ({ versionId }: { versionId: string }) =>
      restoreProgramVersion(programId!, versionId),
    onSuccess: () => {
      // Invalidate both the versions list and the program itself
      queryClient.invalidateQueries({ queryKey: ["program-versions", programId] });
      queryClient.invalidateQueries({ queryKey: ["program", programId] });
    },
  });

  return {
    versions: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    restore: restoreMutation.mutateAsync,
    isRestoring: restoreMutation.isPending,
  };
}
