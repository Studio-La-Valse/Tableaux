import type { ColorHSL, ColorAHSL, ColorRGB } from './color'

export function isColorHSL(value: unknown): value is ColorHSL {
  return (
    typeof value === 'object' &&
    value !== null &&
    'h' in value &&
    typeof value.h == 'number' &&
    's' in value &&
    typeof value.s == 'number' &&
    'l' in value &&
    typeof value.l == 'number'
  )
}

export function isColorAHSL(value: unknown): value is ColorAHSL {
  return isColorHSL(value) && 'a' in value && typeof value.a == 'number'
}

export function toColorRGB({ h, s, l }: ColorHSL): ColorRGB {
  const sNorm = s / 100
  const lNorm = l / 100

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lNorm - c / 2

  let r = 0,
    g = 0,
    b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h < 120) {
    r = x
    g = c
    b = 0
  } else if (h < 180) {
    r = 0
    g = c
    b = x
  } else if (h < 240) {
    r = 0
    g = x
    b = c
  } else if (h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}
