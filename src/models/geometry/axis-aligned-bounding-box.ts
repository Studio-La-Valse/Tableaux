import { IDENTITY_RADIUS } from './circle'
import type { Geometry } from './geometry'
import { IDENTITY_LINE_START, IDENTITY_LINE_END } from './line'
import { IDENTITY_RECTANGLE_TL, IDENTITY_RECTANGLE_BR, IDENTITY_RECTANGLE_TR, IDENTITY_RECTANGLE_BL } from './rectangle'
import { applyMatrix } from './xy'

export type AxisAlignedBoundingBox = {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export function getAxisAlignedBoundingBox(element: Geometry): AxisAlignedBoundingBox {
  switch (element.kind) {
    case 'circle':
      const { a, b, c, d, e, f } = element.transformation

      // center + radius in x/y after affine
      // unit circle → ellipse;
      // max deviation along x is R * sqrt(a^2 + c^2), along y is R * sqrt(b^2 + d^2)
      const cx = e
      const cy = f
      const r = IDENTITY_RADIUS
      const rx = r * Math.hypot(a, c)
      const ry = r * Math.hypot(b, d)

      return {
        minX: cx - rx,
        maxX: cx + rx,
        minY: cy - ry,
        maxY: cy + ry,
      }

    case 'line':
      // only two points
      const p1 = applyMatrix(IDENTITY_LINE_START, element.transformation)
      const p2 = applyMatrix(IDENTITY_LINE_END, element.transformation)
      const minX = Math.min(p1.x, p2.x)
      const maxX = Math.max(p1.x, p2.x)
      const minY = Math.min(p1.y, p2.y)
      const maxY = Math.max(p1.y, p2.y)

      return { minX, minY, maxX, maxY }

    case 'rectangle':
      // four corners of unit rect
      const tl = applyMatrix(IDENTITY_RECTANGLE_TL, element.transformation)
      const tr = applyMatrix(IDENTITY_RECTANGLE_TR, element.transformation)
      const br = applyMatrix(IDENTITY_RECTANGLE_BR, element.transformation)
      const bl = applyMatrix(IDENTITY_RECTANGLE_BL, element.transformation)

      const xs = [tl.x, tr.x, br.x, bl.x]
      const ys = [tl.y, tr.y, br.y, bl.y]

      return {
        minX: Math.min(...xs),
        maxX: Math.max(...xs),
        minY: Math.min(...ys),
        maxY: Math.max(...ys),
      }

    default:
      throw new Error('Unsupported Geometry type')
  }
}
