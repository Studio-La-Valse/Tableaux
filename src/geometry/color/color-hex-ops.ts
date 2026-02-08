import type { Alpha } from './alpha'
import type { ColorHex } from './color-hex'
import type { ColorHSL } from './color-hsl'
import type { ColorHSV } from './color-hsv'
import type { ColorOps } from './color-ops'
import type { ColorRGB } from './color-rgb'
import { ALPHA_MAX, clamp } from './alpha'
import { rgbOps } from './color-rgb-ops'

function hasAlpha(value: ColorHex): boolean {
  return /^#[0-9A-F]{8}$/i.test(value)
}

export const hexOps: ColorOps<ColorHex> = {
  match: (value: unknown): value is ColorHex => {
    return typeof value === 'string' && /^#[0-9A-F]{6}(?:[0-9A-F]{2})?$/i.test(value)
  },

  cast: (value: unknown): ColorHex => {
    if (!hexOps.match(value)) {
      throw new Error('Provided value could not be cast to hex color')
    }

    return value
  },

  extractAlpha: (value: ColorHex): Alpha => {
    // If no alpha channel, return fully opaque
    if (!/^#[0-9A-F]{8}$/i.test(value)) {
      return ALPHA_MAX
    }

    const alphaHex = value.slice(7, 9)
    const alphaInt = Number.parseInt(alphaHex, 16)

    return clamp(alphaInt)
  },

  setAlpha: (value: ColorHex, alpha: Alpha): ColorHex => {
    const alphaHex = alpha
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()

    // Strip existing alpha if present
    const base = value.slice(0, 7).toUpperCase()

    return `${base}${alphaHex}` as ColorHex
  },

  convert: {
    rgb: (hex: ColorHex): ColorRGB => {
      if (!hexOps.match(hex)) {
        throw new Error('Expected #AARRGGBB or #RRGGBB format')
      }

      if (hasAlpha(hex)) {
        const a = Number.parseInt(hex.slice(1, 3), 16)
        const r = Number.parseInt(hex.slice(3, 5), 16)
        const g = Number.parseInt(hex.slice(5, 7), 16)
        const b = Number.parseInt(hex.slice(7, 9), 16)
        return { a: clamp(a), r, g, b }
      }

      const r = Number.parseInt(hex.slice(1, 3), 16)
      const g = Number.parseInt(hex.slice(3, 5), 16)
      const b = Number.parseInt(hex.slice(5, 7), 16)
      return { r, g, b }
    },

    hsl: (hex: ColorHex): ColorHSL => {
      const rgb = hexOps.convert.rgb(hex)
      const hsl = rgbOps.convert.hsl(rgb)
      return hsl
    },

    hsv: (hex: ColorHex): ColorHSV => {
      const rgb = hexOps.convert.rgb(hex)
      const hsv = rgbOps.convert.hsv(rgb)
      return hsv
    },

    hex: (hex: ColorHex): ColorHex => {
      return hex
    },

    css: (hex: ColorHex): string => {
      const rgb = hexOps.convert.rgb(hex)
      return rgbOps.convert.css(rgb)
    },
  },
}
