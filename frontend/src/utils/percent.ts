export const toLearnPercent = (
  retrievability: number | null | undefined,
  retrievabilityCap: number = 0.9
): number =>
  retrievability == null
    ? 0
    : Math.min(Math.round((retrievability / retrievabilityCap) * 100), 100);
