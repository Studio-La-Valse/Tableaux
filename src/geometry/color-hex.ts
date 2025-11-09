import type { ColorARGB, ColorHex, ColorRGB } from './color'

export function isValidHexColor(value: string): value is ColorHex {
  return /^#[0-9A-F]{6}(?:[0-9A-F]{2})?$/i.test(value)
}

export function hasAlpha(value: string): value is `#${string & { length: 9 }}` {
  return /^#[0-9A-F]{8}$/i.test(value)
}

export function isOpaque(value: string): value is `#${string & { length: 7 }}` {
  return /^#[0-9A-F]{6}$/i.test(value)
}

export function toColorARGB(hex: ColorHex): ColorARGB {
  if (!isValidHexColor(hex)) {
    throw new Error('Expected #AARRGGBB or #RRGGBB format')
  }

  if (hasAlpha(hex)) {
    const a = Number.parseInt(hex.slice(1, 3), 16)
    const r = Number.parseInt(hex.slice(3, 5), 16)
    const g = Number.parseInt(hex.slice(5, 7), 16)
    const b = Number.parseInt(hex.slice(7, 9), 16)
    return { a, r, g, b }
  }

  if (isOpaque(hex)) {
    const a = 255
    const r = Number.parseInt(hex.slice(1, 3), 16)
    const g = Number.parseInt(hex.slice(3, 5), 16)
    const b = Number.parseInt(hex.slice(5, 7), 16)
    return { a, r, g, b }
  }

  throw new Error('Unknown hex format found.')
}

export function toColorRGB(hex: ColorHex): ColorRGB {
  if (!isOpaque(hex)) {
    throw new Error('Expected #RRGGBB format')
  }

  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}
