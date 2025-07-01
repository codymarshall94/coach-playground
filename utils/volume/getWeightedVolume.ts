export const getWeightedVolume = (
  activationMap: Record<string, number>,
  totalVolume: number
): Record<string, number> => {
  const result: Record<string, number> = {};
  for (const [muscle, activation] of Object.entries(activationMap)) {
    result[muscle] = (result[muscle] || 0) + totalVolume * activation;
  }
  return result;
};
