import type { Alpha } from './alpha'
import type { ColorHex } from './color-hex'
import type { ColorHSL } from './color-hsl'
import type { ColorHSV } from './color-hsv'
import type { ColorOps } from './color-ops'
import type { ColorRGB } from './color-rgb'
import { ALPHA_MAX, isAlpha } from './alpha'
import { RGB_MAX, rgbOps } from './color-rgb-ops'

export const HSL_MAX_HUE = 360
export const HSL_MAX_SAT = 100
export const HSL_MAX_LUM = 100

function hasAlpha(value: ColorHSL): value is ColorHSL & { a: Alpha } {
  return 'a' in value && typeof value.a === 'number' && isAlpha(value.a)
}

export const hslOps: ColorOps<ColorHSL> = {
  match: (value: unknown): value is ColorHSL => {
    return (
      typeof value === 'object'
      && value !== null
      && 'h' in value
      && typeof value.h == 'number'
      && 's' in value
      && typeof value.s == 'number'
      && 'l' in value
      && typeof value.l == 'number'
    )
  },

  cast: (value: unknown): ColorHSL => {
    if (!hslOps.match(value)) {
      throw new Error('Provided value could not be cast to hsl color')
    }

    return value
  },

  extractAlpha: (value: ColorHSL): Alpha => {
    return hasAlpha(value) ? value.a : ALPHA_MAX
  },
  setAlpha: (value: ColorHSL, a: Alpha) => {
    return {
      ...value,
      a,
    }
  },
  convert: {
    rgb: (value: ColorHSL): ColorRGB => {
      const { h, s, l } = value
      const a = hasAlpha(value) ? value.a : undefined

      const sNorm = s / HSL_MAX_SAT
      const lNorm = l / HSL_MAX_LUM

      const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
      const m = lNorm - c / 2

      let r = 0
      let g = 0
      let b = 0

      if (h >= 0 && h < 60) {
        r = c
        g = x
        b = 0
      }
      else if (h < 120) {
        r = x
        g = c
        b = 0
      }
      else if (h < 180) {
        r = 0
        g = c
        b = x
      }
      else if (h < 240) {
        r = 0
        g = x
        b = c
      }
      else if (h < 300) {
        r = x
        g = 0
        b = c
      }
      else {
        r = c
        g = 0
        b = x
      }

      return {
        r: Math.round((r + m) * RGB_MAX),
        g: Math.round((g + m) * RGB_MAX),
        b: Math.round((b + m) * RGB_MAX),
        a,
      }
    },
    hsl: (value: ColorHSL): ColorHSL => {
      return {
        ...value,
      }
    },
    hsv: (value: ColorHSL): ColorHSV => {
      const rgb = hslOps.convert.rgb(value)
      const hsv = rgbOps.convert.hsv(rgb)
      return hsv
    },
    hex: (value: ColorHSL): ColorHex => {
      const rgb = hslOps.convert.rgb(value)
      const hex = rgbOps.convert.hex(rgb)
      return hex
    },
    css: (value: ColorHSL): string => {
      const rgb = hslOps.convert.rgb(value)
      const css = rgbOps.convert.css(rgb)
      return css
    },
  },
}
