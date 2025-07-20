export type Fill = { fill: string }

export function hasFill(value: object): value is Fill {
  return (
    typeof value === 'object' && value !== null && 'fill' in value && typeof value.fill === 'string'
  )
}

export type Stroke = { stroke: string; strokeWidth: number }

export function hasStroke(value: object): value is Stroke {
  return (
    typeof value === 'object' &&
    value !== null &&
    'stroke' in value &&
    typeof value.stroke === 'string' &&
    'strokeWidth' in value &&
    typeof value.strokeWidth === 'number'
  )
}
