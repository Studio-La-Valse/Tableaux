export type RoundCorners = Partial<{
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}>;

export function hasRoundCorners(value: object): value is RoundCorners {
  if (typeof value !== 'object' || value === null) return false;

  const corners = value as Record<string, unknown>;

  const cornerKeys = [
    'topLeft',
    'topRight',
    'bottomRight',
    'bottomLeft',
  ] as const;

  let hasValidCorner = false;

  for (const key of cornerKeys) {
    const val = corners[key];
    if (val !== undefined) {
      if (typeof val !== 'number') return false;
      hasValidCorner = true;
    }
  }

  return hasValidCorner;
}
