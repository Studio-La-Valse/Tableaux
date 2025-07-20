import type { Circle, DrawableCircle } from './circle'
import type { DrawableLine, Line } from './line'
import type { DrawableRectangle, Rectangle } from './rectangle'
import type { XY } from './xy'

export type geometry = Circle | Line | Rectangle | XY

export type DrawableGeometry = DrawableCircle | DrawableLine | DrawableRectangle
