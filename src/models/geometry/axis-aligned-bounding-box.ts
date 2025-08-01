import { deconstruct as deconstructCircle } from './circle'
import { deconstruct as deconstructEllipse } from './ellipse'
import { deconstruct as deconstructLine } from './line'
import { deconstruct as deconstructRectangle } from './rectangle'
import { deconstruct as deconstructSquare } from './square'
import { deconstruct as deconstructParallelogram } from './parallelogram'
import type { Shape } from './geometry'

export type AxisAlignedBoundingBox = {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export function getAxisAlignedBoundingBox(element: Shape): AxisAlignedBoundingBox {
  switch (element.kind) {
    case 'circle': {
      const { origin, radius } = deconstructCircle(element)
      return {
        minX: origin.x - radius,
        maxX: origin.x + radius,
        minY: origin.y - radius,
        maxY: origin.y + radius,
      }
    }

    case 'ellipse': {
      const { origin, radiusX, radiusY } = deconstructEllipse(element)
      return {
        minX: origin.x - radiusX,
        maxX: origin.x + radiusX,
        minY: origin.y - radiusY,
        maxY: origin.y + radiusY,
      }
    }

    case 'line': {
      const { start, end } = deconstructLine(element)
      return {
        minX: Math.min(start.x, end.x),
        maxX: Math.max(start.x, end.x),
        minY: Math.min(start.y, end.y),
        maxY: Math.max(start.y, end.y),
      }
    }

    case 'rectangle': {
      const { topLeft, topRight, bottomLeft, bottomRight } = deconstructRectangle(element)
      const corners = [topLeft, topRight, bottomLeft, bottomRight]
      const xs = corners.map((p) => p.x)
      const ys = corners.map((p) => p.y)
      return {
        minX: Math.min(...xs),
        maxX: Math.max(...xs),
        minY: Math.min(...ys),
        maxY: Math.max(...ys),
      }
    }

    case 'square': {
      const { topLeft, topRight, bottomLeft, bottomRight } = deconstructSquare(element)
      const corners = [topLeft, topRight, bottomLeft, bottomRight]
      const xs = corners.map((p) => p.x)
      const ys = corners.map((p) => p.y)
      return {
        minX: Math.min(...xs),
        maxX: Math.max(...xs),
        minY: Math.min(...ys),
        maxY: Math.max(...ys),
      }
    }

    case 'parallelogram': {
      const { topLeft, topRight, bottomLeft, bottomRight } = deconstructParallelogram(element)
      const corners = [topLeft, topRight, bottomLeft, bottomRight]
      const xs = corners.map((p) => p.x)
      const ys = corners.map((p) => p.y)
      return {
        minX: Math.min(...xs),
        maxX: Math.max(...xs),
        minY: Math.min(...ys),
        maxY: Math.max(...ys),
      }
    }

    default:
      throw new Error('Unsupported Geometry type')
  }
}
