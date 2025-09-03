import { getTemplates } from "@/services/templateService";
import { useQuery } from "@tanstack/react-query";

export const useTemplates = () => {
  const {
    data: templates,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  return { templates, isLoading, error };
};

export default useTemplates;
