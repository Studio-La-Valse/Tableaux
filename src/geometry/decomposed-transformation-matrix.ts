import type { TransformationMatrix } from './transformation-matrix'
import type { XY } from './xy'

export interface DecomposedMatrix {
  translation: XY // e, f
  rotation: number // in radians
  scale: XY // scaleX, scaleY
  skew: XY // skewX, skewY (radians)
}

export function getTranslation(m: TransformationMatrix): XY {
  return { x: m.e, y: m.f }
}

export function getRotation(m: TransformationMatrix): number {
  return Math.atan2(m.b, m.a)
}

export function getScale(m: TransformationMatrix): XY {
  const { a, b, c, d } = m

  // First column length = scaleX
  const scaleX = Math.hypot(a, b)

  // Remove the contribution of scaleX from the second column
  const shear = (a * c + b * d) / scaleX
  const cPrime = c - ((a * shear) / scaleX) * scaleX
  const dPrime = d - ((b * shear) / scaleX) * scaleX

  // Second column length = scaleY
  const scaleY = Math.hypot(cPrime, dPrime)

  return { x: scaleX, y: scaleY }
}

export function getSkew(m: TransformationMatrix): XY {
  const { a, b, c, d } = m

  // normalize first column
  const scaleX = Math.hypot(a, b)
  const normA = a / scaleX
  const normB = b / scaleX

  // shear = dot(normalized-first-column, second-column)
  const shear = normA * c + normB * d

  // skewX = atan(shear)
  // skewY is rarely needed for pure 2D CSS-style matrices; set to 0
  return { x: Math.atan(shear), y: 0 }
}

export function decomposeMatrix(m: TransformationMatrix): DecomposedMatrix {
  // translation part
  const translation: XY = getTranslation(m)

  // rotation part
  const rotation = getRotation(m)

  // scale part
  const scale = getScale(m)

  // skew part
  const skew = getSkew(m)

  return { translation, rotation, scale, skew }
}
