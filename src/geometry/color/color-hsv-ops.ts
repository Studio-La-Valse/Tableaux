import type { Alpha } from './alpha'
import type { ColorHex } from './color-hex'
import type { ColorHSL } from './color-hsl'
import type { ColorHSV } from './color-hsv'
import type { ColorOps } from './color-ops'
import type { ColorRGB } from './color-rgb'
import { ALPHA_MAX, isAlpha } from './alpha'
import { RGB_MAX, rgbOps } from './color-rgb-ops'

export const HSV_HUE_MAX = 360
export const HSV_SAT_MAX = 100
export const HSV_VAL_MAX = 100

function hasAlpha(value: ColorHSV): value is ColorHSV & { a: Alpha } {
  return 'a' in value && typeof value.a === 'number' && isAlpha(value.a)
}

export const hsvOps: ColorOps<ColorHSV> = {
  match: (value: unknown): value is ColorHSV => {
    return (
      typeof value === 'object'
      && value !== null
      && 'h' in value
      && typeof value.h == 'number'
      && 's' in value
      && typeof value.s == 'number'
      && 'v' in value
      && typeof value.v == 'number'
    )
  },

  cast: (value: unknown): ColorHSV => {
    if (!hsvOps.match(value)) {
      throw new Error('Provided value could not be cast to hsv color')
    }

    return value
  },

  extractAlpha: (value: ColorHSV): Alpha => {
    return hasAlpha(value) ? value.a : ALPHA_MAX
  },

  setAlpha: (value: ColorHSV, a: Alpha) => {
    return {
      ...value,
      a,
    }
  },

  convert: {
    rgb: (value: ColorHSV): ColorRGB => {
      const { h, s, v } = value
      const a = hasAlpha(value) ? value.a : undefined

      const sNorm = s / HSV_SAT_MAX
      const vNorm = v / HSV_VAL_MAX

      const c = vNorm * sNorm
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
      const m = vNorm - c

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

    hsl: (value: ColorHSV): ColorHSL => {
      const rgb = hsvOps.convert.rgb(value)
      const hsl = rgbOps.convert.hsl(rgb)
      return hsl
    },

    hsv: (value: ColorHSV): ColorHSV => {
      return {
        ...value,
      }
    },

    hex: (value: ColorHSV): ColorHex => {
      const rgb = hsvOps.convert.rgb(value)
      const hex = rgbOps.convert.hex(rgb)
      return hex
    },

    css: (value: ColorHSV): string => {
      const rgb = hsvOps.convert.rgb(value)
      const css = rgbOps.convert.css(rgb)
      return css
    },
  },
}
