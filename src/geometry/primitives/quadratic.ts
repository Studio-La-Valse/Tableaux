import type { Line } from './line'
import type { XY } from './xy'

export type Quadratic = Line & {
  control: XY
}
