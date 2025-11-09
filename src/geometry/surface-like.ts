import type { CircleShape } from './circle'
import type { ClearRectShape } from './clear-rect'
import type { EllipseShape } from './ellipse'
import type { RectangleShape } from './rectangle'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isCircle } from './circle'
import { isEllipse } from './ellipse'
import { isRectangle } from './rectangle'
import { identity, invert } from './transformation-matrix'
import { applyMatrix } from './xy'

export const surfaceKinds = ['circle', 'ellipse', 'rectangle', 'clear-rect'] as const

export type SurfaceKind = (typeof surfaceKinds)[number]

export function isSurfaceKind(str: string): str is SurfaceKind {
  return str in surfaceKinds
}

export type SurfaceLike = CircleShape | EllipseShape | RectangleShape | ClearRectShape

export function asSurfaceLike(value: JsonObject): SurfaceLike {
  if (isCircle(value)) {
    return {
      ...value,
      kind: 'circle',
    }
  }

  if (isEllipse(value)) {
    return {
      ...value,
      kind: 'ellipse',
    }
  }

  if (isRectangle(value)) {
    let kind: 'rectangle' | 'clear-rect' = 'rectangle'
    if ('kind' in value && typeof value.kind === 'string' && value.kind === 'clear-rect') {
      kind = 'clear-rect'
    }
    return {
      ...value,
      kind,
    }
  }

  throw new Error('Shape is not surface like.')
}

export function isSurfaceLike(object: JsonObject): object is SurfaceLike {
  if (!('kind' in object))
    return false
  if (!(typeof object.kind === 'string'))
    return false
  if (!isSurfaceKind(object.kind))
    return false

  switch (object.kind) {
    case 'circle':
      return isCircle(object)
    case 'ellipse':
      return isEllipse(object)
    case 'clear-rect':
    case 'rectangle':
      return isRectangle(object)
  }
}

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
