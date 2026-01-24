import type { Circle } from './circle'

export type Arc = Circle & {
  startAngle: number
  endAngle: number
  counterclockwise: boolean
}
