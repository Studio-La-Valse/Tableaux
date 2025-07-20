export type XY = { x: number; y: number }

export function isXY(value: unknown): value is XY {
  return (
    typeof value === 'object' &&
    value !== null &&
    'x' in value &&
    'y' in value &&
    typeof value.x === 'number' &&
    typeof value.y === 'number'
  )
}
