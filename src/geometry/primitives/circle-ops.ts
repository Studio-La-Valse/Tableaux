import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { Circle } from './circle'
import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isXY } from './xy'

export type CircleOps = CurveOps<Circle> & {

}

export const circleOps: CircleOps = {
  guard(object: JsonObject): object is Circle {
    return (
      isXY(object)
      && 'radius' in object
      && typeof object.radius === 'number'
    )
  },

  cast(object: JsonObject): Circle {
    if (this.guard(object)) {
      return { ...object }
    }
    throw new Error('Object could not be cast to a circle')
  },

  /**
   * Returns a point on the circle at parameter t ∈ [0,1].
   * t is interpreted as an angle fraction: angle = t * 2π.
   * If a transformation matrix is provided, the point is transformed.
   */
  pointAt(shape: Circle, t: number, m?: TransformationMatrix): XY {
    const angle = t * Math.PI * 2
    const px = shape.x + shape.radius * Math.cos(angle)
    const py = shape.y + shape.radius * Math.sin(angle)

    if (!m)
      return { x: px, y: py }

    return {
      x: m.a * px + m.c * py + m.e,
      y: m.b * px + m.d * py + m.f,
    }
  },

  /**
   * Returns the circumference of the transformed circle.
   * If no matrix is provided, returns 2πr.
   * If a matrix is provided, the circle becomes an ellipse.
   */
  length(shape: Circle, m?: TransformationMatrix): number {
    if (!m)
      return 2 * Math.PI * shape.radius

    // Compute singular values of the linear part
    const { a, b, c, d } = m
    const S1 = a * a + b * b
    const S2 = c * c + d * d
    const S3 = a * c + b * d

    const trace = S1 + S2
    const root = Math.sqrt((S1 - S2) ** 2 + 4 * S3 * S3)

    const lambda1 = (trace + root) / 2
    const lambda2 = (trace - root) / 2

    const sigma1 = Math.sqrt(lambda1)
    const sigma2 = Math.sqrt(lambda2)

    const aAxis = sigma1 * shape.radius
    const bAxis = sigma2 * shape.radius

    // Ramanujan approximation
    return (
      Math.PI
      * (3 * (aAxis + bAxis)
        - Math.sqrt((3 * aAxis + bAxis) * (aAxis + 3 * bAxis)))
    )
  },

  /**
   * Returns the bounding box of the transformed circle.
   * A transformed circle is an ellipse.
   * We compute the extreme points by sampling the ellipse derivative roots.
   */
  boundingBox(shape: Circle, m?: TransformationMatrix): Rectangle {
    const r = shape.radius

    // If no transform: trivial
    if (!m) {
      return {
        x: shape.x - r,
        y: shape.y - r,
        width: 2 * r,
        height: 2 * r,
      }
    }

    // We transform the circle into an ellipse:
    // p(t) = M * (x + r cos t, y + r sin t)
    // The extrema occur at derivative roots.
    // But easiest robust method: sample sufficiently many points.

    const samples = 180 // 2° resolution — safe & fast
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (let i = 0; i < samples; i++) {
      const t = (i / samples) * Math.PI * 2
      const px = shape.x + r * Math.cos(t)
      const py = shape.y + r * Math.sin(t)

      const x = m.a * px + m.c * py + m.e
      const y = m.b * px + m.d * py + m.f

      if (x < minX)
        minX = x
      if (x > maxX)
        maxX = x
      if (y < minY)
        minY = y
      if (y > maxY)
        maxY = y
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  },
}
