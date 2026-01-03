import type { Arc } from '../arc'
import type { BoundingBox } from '../bounding-box'
import type { Circle } from '../circle'
import type { Ellipse } from '../ellipse'
import type { EllipticalArc } from '../elliptical-arc'
import type { Rectangle } from '../rectangle'

export type Surface = Arc | BoundingBox | Circle | Ellipse | EllipticalArc | Rectangle
