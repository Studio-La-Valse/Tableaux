export type Color = ColorHex | ColorRGB | ColorARGB

export type ColorHex = `#${string}`

export function isValidHexColor(value: string): value is ColorHex {
  return /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(value)
}

export function hasAlpha(value: string): value is `#${string & { length: 9 }}` {
  return /^#[0-9A-Fa-f]{8}$/.test(value)
}

export function isOpaque(value: string): value is `#${string & { length: 7 }}` {
  return /^#[0-9A-Fa-f]{6}$/.test(value)
}

export type ColorRGB = { r: number; g: number; b: number } // each 0–255
export type ColorARGB = { a: number } & ColorRGB // each 0–255

export function isRGB(value: unknown): value is ColorARGB {
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

export function isARGB(value: unknown): value is ColorARGB {
  return isRGB(value) && 'a' in value && typeof value.a == 'number'
}

function clampChannelValue(value: number): number {
  return Math.max(0, Math.min(255, value))
}

export function hexToARGB(hex: ColorHex): ColorARGB {
  if (!isValidHexColor(hex)) {
    throw new Error('Expected #AARRGGBB or #RRGGBB format')
  }

  if (hasAlpha(hex)) {
    const a = parseInt(hex.slice(1, 3), 16)
    const r = parseInt(hex.slice(3, 5), 16)
    const g = parseInt(hex.slice(5, 7), 16)
    const b = parseInt(hex.slice(7, 9), 16)
    return { a, r, g, b }
  }

  if (isOpaque(hex)) {
    const a = 255
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { a, r, g, b }
  }

  throw new Error('Unknown hex format found.')
}

export function hexToRGB(hex: ColorHex): ColorRGB {
  if (!isOpaque(hex)) {
    throw new Error('Expected #RRGGBB format')
  }

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

export function rgbToHex(colorRGB: ColorRGB): ColorHex {
  const toHex = (n: number) => clampChannelValue(n).toString(16).padStart(2, '0')
  return `#${toHex(colorRGB.r)}${toHex(colorRGB.g)}${toHex(colorRGB.b)}`
}

export function argbToHex(colorARGB: ColorARGB): ColorHex {
  const toHex = (n: number) => clampChannelValue(n).toString(16).padStart(2, '0')
  return `#${toHex(colorARGB.a)}${toHex(colorARGB.r)}${toHex(colorARGB.g)}${toHex(colorARGB.b)}`
}

export function formatCSSRGBA(color: ColorRGB): string {
  const alpha = isARGB(color) ? color.a : 255
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha / 255})`
}
