import type { Line } from './line'
import type { XY } from './xy'

export type Cubic = Line & {
  control1: XY
  control2: XY
}
