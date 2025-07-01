const PRIMARY_THRESHOLD = 0.7;
const SECONDARY_THRESHOLD = 0.4;

export const getPrimaryAndSecondaryMuscles = (
  activationMap: Record<string, number>
) => {
  const primary = [];
  const secondary = [];

  for (const [muscle, value] of Object.entries(activationMap)) {
    if (value >= PRIMARY_THRESHOLD) {
      primary.push(muscle);
    } else if (value >= SECONDARY_THRESHOLD) {
      secondary.push(muscle);
    }
  }

  return { primary, secondary };
};
