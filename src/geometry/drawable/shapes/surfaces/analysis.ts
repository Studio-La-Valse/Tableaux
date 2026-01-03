import type { SurfaceLike } from './surface-like'
import type { XY } from '@/geometry/primitives/xy'
import { applyMatrix } from '@/geometry/primitives/xy'
import { mulberry32 } from '@/geometry/random'
import { identity, invert } from '@/geometry/transform/transformation-matrix'

export function pointOnSurface(surface: SurfaceLike, point: XY, epsilon = 1e-6): boolean {
  // Transform point into local coordinates
  const localPoint = surface.t ? applyMatrix(point, invert(surface.t)) : point

  switch (surface.kind) {
    case 'circle': {
      const { x, y, radius } = surface
      const dx = localPoint.x - x
      const dy = localPoint.y - y
      const dist = Math.hypot(dx, dy)
      return Math.abs(dist - radius) <= epsilon
    }

    case 'ellipse': {
      const { x, y, radiusX, radiusY, rotation } = surface
      // Rotate point back by -rotation
      const cosR = Math.cos(-rotation)
      const sinR = Math.sin(-rotation)
      const dx = localPoint.x - x
      const dy = localPoint.y - y
      const xr = dx * cosR - dy * sinR
      const yr = dx * sinR + dy * cosR

      // Normalized ellipse equation
      const value = (xr * xr) / (radiusX * radiusX) + (yr * yr) / (radiusY * radiusY)
      return Math.abs(value - 1) <= epsilon
    }

    case 'clear-rect':
    case 'rectangle': {
      const { x, y, width, height } = surface
      const px = localPoint.x
      const py = localPoint.y

      const onLeft = Math.abs(px - x) <= epsilon && py >= y - epsilon && py <= y + height + epsilon
      if (onLeft)
        return true
      const onRight
        = Math.abs(px - (x + width)) <= epsilon && py >= y - epsilon && py <= y + height + epsilon
      if (onRight)
        return true
      const onTop = Math.abs(py - y) <= epsilon && px >= x - epsilon && px <= x + width + epsilon
      if (onTop)
        return true
      const onBottom
        = Math.abs(py - (y + height)) <= epsilon && px >= x - epsilon && px <= x + width + epsilon
      return onBottom
    }
  }
}

export function pointInSurface(surface: SurfaceLike, point: XY): boolean {
  // Transform point into local coordinates
  const localPoint = surface.t ? applyMatrix(point, invert(surface.t)) : point

  switch (surface.kind) {
    case 'circle': {
      const { x, y, radius } = surface
      const dx = localPoint.x - x
      const dy = localPoint.y - y
      const distSq = dx * dx + dy * dy
      return distSq <= radius * radius
    }

    case 'ellipse': {
      const { x, y, radiusX, radiusY, rotation } = surface
      // Rotate point back by -rotation
      const cosR = Math.cos(-rotation)
      const sinR = Math.sin(-rotation)
      const dx = localPoint.x - x
      const dy = localPoint.y - y
      const xr = dx * cosR - dy * sinR
      const yr = dx * sinR + dy * cosR

      const value = (xr * xr) / (radiusX * radiusX) + (yr * yr) / (radiusY * radiusY)
      return value <= 1
    }

    case 'clear-rect':
    case 'rectangle': {
      const { x, y, width, height } = surface
      return (
        localPoint.x >= x
        && localPoint.x <= x + width
        && localPoint.y >= y
        && localPoint.y <= y + height
      )
    }
  }
}

export function getSurfaceCenter(surface: SurfaceLike): XY {
  let local: XY

  switch (surface.kind) {
    case 'circle': {
      const { x, y } = surface
      local = { x, y }
      break
    }

    case 'ellipse': {
      const { x, y } = surface
      local = { x, y }
      break
    }

    case 'clear-rect':
    case 'rectangle': {
      const { x, y, width, height } = surface
      local = { x: x + width / 2, y: y + height / 2 }
      break
    }
  }

  // Apply optional transform
  return applyMatrix(local, surface.t ?? identity())
}

// ===== Sampling points utilities

export function samplePointsOnSurface(
  surface: SurfaceLike,
  count: number,
  seed: number,
): XY[] {
  const rand = mulberry32(seed)
  const pts: XY[] = []

  for (let i = 0; i < count; i++) {
    pts.push(sampleOne(surface, rand))
  }

  return pts
}

export function sampleOne(surface: SurfaceLike, rand: () => number): XY {
  // Initialize with a placeholder; will always be overwritten
  let p: XY = { x: 0, y: 0 }

  switch (surface.kind) {
    case 'circle': {
      const { x, y, radius } = surface
      const angle = rand() * Math.PI * 2
      p = {
        x: x + radius * Math.cos(angle),
        y: y + radius * Math.sin(angle),
      }
      break
    }

    case 'ellipse': {
      const { x, y, radiusX, radiusY, rotation } = surface
      const angle = rand() * Math.PI * 2

      const xr = radiusX * Math.cos(angle)
      const yr = radiusY * Math.sin(angle)

      const cosR = Math.cos(rotation)
      const sinR = Math.sin(rotation)

      p = {
        x: x + xr * cosR - yr * sinR,
        y: y + xr * sinR + yr * cosR,
      }
      break
    }

    case 'rectangle':
    case 'clear-rect': {
      const { x, y, width, height } = surface

      const edge = Math.floor(rand() * 4)
      const t = rand()

      switch (edge) {
        case 0:
          p = { x: x + t * width, y }
          break
        case 1:
          p = { x: x + t * width, y: y + height }
          break
        case 2:
          p = { x, y: y + t * height }
          break
        case 3:
          p = { x: x + width, y: y + t * height }
          break
      }
      break
    }

    default:
      throw new Error(`Unsupported surface kind: ${(surface as any).kind}`)
  }

  return surface.t ? applyMatrix(p, surface.t) : p
}
