import { isXY, type XY } from './xy'

export type Rotation = { origin: XY; angle: number }

export function hasRotation(element: unknown): element is Rotation {
  return (
    typeof element === 'object' &&
    element !== null &&
    'origin' in element &&
    isXY(element.origin) &&
    'angle' in element &&
    typeof element.angle === 'number'
  )
}
