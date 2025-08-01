import type { ColorARGB, ColorHex, ColorHSL, ColorHSV, ColorRGB } from './color'

export function isColorRGB(value: unknown): value is ColorARGB {
  return (
    typeof value === 'object' &&
    value !== null &&
    'r' in value &&
    typeof value.r == 'number' &&
    'g' in value &&
    typeof value.g == 'number' &&
    'b' in value &&
    typeof value.b == 'number'
  )
}

export function isColorARGB(value: unknown): value is ColorARGB {
  return isColorRGB(value) && 'a' in value && typeof value.a == 'number'
}

export function assertIsColorARGB(value: unknown): ColorARGB {
  if (!isColorARGB(value)){
    throw new Error("Value is not color ARGB")
  }

  return value
}

export function toColorHex(colorRGB: ColorRGB): ColorHex {
  const clampChannelValue = (value: number): number => Math.max(0, Math.min(255, value))
  const toHex = (n: number) => clampChannelValue(n).toString(16).padStart(2, '0')

  return isColorARGB(colorRGB)
    ? `#${toHex(colorRGB.a)}${toHex(colorRGB.r)}${toHex(colorRGB.g)}${toHex(colorRGB.b)}`
    : `#${toHex(colorRGB.r)}${toHex(colorRGB.g)}${toHex(colorRGB.b)}`
}

export function toColorHSV({ r, g, b }: ColorRGB): ColorHSV {
  const rNorm = r / 255,
    gNorm = g / 255,
    bNorm = b / 255
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2
    } else {
      h = (rNorm - gNorm) / delta + 4
    }
  }

  h *= 60
  if (h < 0) h += 360

  const s = max === 0 ? 0 : delta / max
  const v = max

  return {
    h: Math.round(h),
    s: parseFloat((s * 100).toFixed(1)),
    v: parseFloat((v * 100).toFixed(1)),
  }
}

export function toColorHSL({ r, g, b }: ColorRGB): ColorHSL {
  const rNorm = r / 255,
    gNorm = g / 255,
    bNorm = b / 255
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2
    } else {
      h = (rNorm - gNorm) / delta + 4
    }
  }

  h *= 60
  if (h < 0) h += 360

  const l = (max + min) / 2
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  return {
    h: Math.round(h),
    s: parseFloat((s * 100).toFixed(1)),
    l: parseFloat((l * 100).toFixed(1)),
  }
}

export function formatCSSRGBA(color: ColorRGB): string {
  const alpha = isColorARGB(color) ? color.a : 255
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha / 255})`
}
