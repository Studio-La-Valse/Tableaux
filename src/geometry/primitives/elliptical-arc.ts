import type { Ellipse } from './ellipse'

export type EllipticalArc = Ellipse & {
  startAngle: number
  endAngle: number
  counterclockwise: boolean
}
