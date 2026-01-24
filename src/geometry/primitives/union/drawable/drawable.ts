import type { Arc } from '../../arc'
import type { Circle } from '../../circle'
import type { Cubic } from '../../cubic'
import type { Ellipse } from '../../ellipse'
import type { EllipticalArc } from '../../elliptical-arc'
import type { Line } from '../../line'
import type { Polyline } from '../../polyline'
import type { Quadratic } from '../../quadratic'
import type { Rectangle } from '../../rectangle'
import type { Fill } from './fill'
import type { Filter } from './filter'
import type { Stroke } from './stroke'
import type { Text } from '@/geometry/text/text'
import type { TransformationMatrix } from '@/geometry/transform/transformation-matrix'

export type Drawable = (
  Arc | Circle | Cubic | Ellipse | EllipticalArc | Line | Polyline | Quadratic | Rectangle | Text
) & {
  t?: TransformationMatrix
} & Filter
& Partial<Stroke & Fill>
