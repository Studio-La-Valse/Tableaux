import type { Alpha } from './alpha'
import type { ColorHex } from './color-hex'
import type { ColorHSL } from './color-hsl'
import type { ColorHSV } from './color-hsv'
import type { ColorOps } from './color-ops'
import type { ColorRGB } from './color-rgb'
import { ALPHA_MAX, isAlpha } from './alpha'
import { HSL_MAX_HUE, HSL_MAX_LUM, HSL_MAX_SAT } from './color-hsl-ops'
import { HSV_HUE_MAX, HSV_SAT_MAX, HSV_VAL_MAX } from './color-hsv-ops'

export const RGB_MAX = 255

function hasAlpha(value: ColorRGB): value is ColorRGB & { a: Alpha } {
  return 'a' in value && typeof value.a === 'number' && isAlpha(value.a)
}

export const rgbOps: ColorOps<ColorRGB> = {
  match(value: unknown): value is ColorRGB {
    return (
      typeof value === 'object'
      && value !== null
      && 'r' in value
      && typeof value.r == 'number'
      && 'g' in value
      && typeof value.g == 'number'
      && 'b' in value
      && typeof value.b == 'number'
    )
  },

  cast: (value: unknown): ColorRGB => {
    if (!rgbOps.match(value)) {
      throw new Error('Provided value could not be cast to rgb color')
    }

    return value
  },

  extractAlpha(value: ColorRGB): Alpha {
    return hasAlpha(value) ? value.a : RGB_MAX
  },

  setAlpha(value: ColorRGB, alpha: Alpha): ColorRGB {
    return {
      ...value,
      a: alpha,
    }
  },

  convert: {
    rgb(value: ColorRGB): ColorRGB {
      return { ...value }
    },

    hsl(value: ColorRGB): ColorHSL {
      const { r, g, b } = value
      const a = hasAlpha(value) ? rgbOps.extractAlpha(value) : undefined

      const rNorm = r / RGB_MAX
      const gNorm = g / RGB_MAX
      const bNorm = b / RGB_MAX
      const max = Math.max(rNorm, gNorm, bNorm)
      const min = Math.min(rNorm, gNorm, bNorm)
      const delta = max - min

      let h = 0
      if (delta !== 0) {
        if (max === rNorm) {
          h = ((gNorm - bNorm) / delta) % 6
        }
        else if (max === gNorm) {
          h = (bNorm - rNorm) / delta + 2
        }
        else {
          h = (rNorm - gNorm) / delta + 4
        }
      }

      h *= (HSL_MAX_HUE / 6)
      if (h < 0)
        h += HSL_MAX_HUE

      const l = (max + min) / 2
      const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

      const hsl = {
        h: Math.round(h),
        s: Number.parseFloat((s * HSL_MAX_SAT).toFixed(1)),
        l: Number.parseFloat((l * HSL_MAX_LUM).toFixed(1)),
        a,
      }

      return hsl
    },

    hsv(value: ColorRGB): ColorHSV {
      const { r, g, b } = value
      const a = hasAlpha(value) ? rgbOps.extractAlpha(value) : undefined
      const rNorm = r / RGB_MAX
      const gNorm = g / RGB_MAX
      const bNorm = b / RGB_MAX
      const max = Math.max(rNorm, gNorm, bNorm)
      const min = Math.min(rNorm, gNorm, bNorm)
      const delta = max - min

      let h = 0
      if (delta !== 0) {
        if (max === rNorm) {
          h = ((gNorm - bNorm) / delta) % 6
        }
        else if (max === gNorm) {
          h = (bNorm - rNorm) / delta + 2
        }
        else {
          h = (rNorm - gNorm) / delta + 4
        }
      }

      h *= (HSV_HUE_MAX / 6)
      if (h < 0)
        h += HSV_HUE_MAX

      const s = max === 0 ? 0 : delta / max
      const v = max

      const hsv = {
        h: Math.round(h),
        s: Number.parseFloat((s * HSV_SAT_MAX).toFixed(1)),
        v: Number.parseFloat((v * HSV_VAL_MAX).toFixed(1)),
        a,
      }

      return hsv
    },

    hex(value: ColorRGB): ColorHex {
      const clampChannelValue = (value: number): number => Math.max(0, Math.min(RGB_MAX, value))
      const toHex = (n: number) => clampChannelValue(n).toString(16).padStart(2, '0')

      return hasAlpha(value)
        ? `#${toHex(value.a)}${toHex(value.r)}${toHex(value.g)}${toHex(value.b)}`
        : `#${toHex(value.r)}${toHex(value.g)}${toHex(value.b)}`
    },

    css(value: ColorRGB) {
      return hasAlpha(value)
        ? `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a / ALPHA_MAX})`
        : `rgb(${value.r}, ${value.g}, ${value.b})`
    },
  },
}
