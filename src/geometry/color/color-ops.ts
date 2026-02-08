import type { Alpha } from './alpha'
import type { Color } from './color'
import type { ColorHex } from './color-hex'
import type { ColorHSL } from './color-hsl'
import type { ColorHSV } from './color-hsv'
import type { ColorRGB } from './color-rgb'
import { hexOps } from './color-hex-ops'
import { hslOps } from './color-hsl-ops'
import { hsvOps } from './color-hsv-ops'
import { rgbOps } from './color-rgb-ops'

export type ColorOps<T extends Color> = {
  match: (value: unknown) => value is T
  cast: (value: unknown) => T
  extractAlpha: (value: T) => Alpha
  setAlpha: (value: T, alpha: Alpha) => T
  convert: {
    rgb: (value: T) => ColorRGB
    hsl: (value: T) => ColorHSL
    hsv: (value: T) => ColorHSV
    hex: (value: T) => ColorHex
    css: (value: T) => string
  }
}

const registeredOps = [
  hexOps,
  hslOps,
  hsvOps,
  rgbOps,
] as const

function getOps<T extends Color>(value: Color): ColorOps<T> {
  for (const ops of registeredOps) {
    if (ops.match(value)) {
      return ops as any as ColorOps<T>
    }
  }

  throw new Error('No ops defined for provided value')
}

export const colorOps: ColorOps<Color> = {
  match: (value: unknown): value is Color => {
    for (const ops of registeredOps) {
      if (ops.match(value)) {
        return true
      }
    }

    return false
  },
  cast: (value: unknown): Color => {
    if (!colorOps.match(value)) {
      throw new Error('Provided value is not a registered color type')
    }

    return getOps(value).cast(value)
  },
  extractAlpha: (value: Color): Alpha => getOps(value).extractAlpha(value),
  setAlpha: (value: Color, a: Alpha) => getOps(value).setAlpha(value, a),
  convert: {
    rgb: (value: Color): ColorRGB => getOps(value).convert.rgb(value),
    hsl: (value: Color): ColorHSL => getOps(value).convert.hsl(value),
    hsv: (value: Color): ColorHSV => getOps(value).convert.hsv(value),
    hex: (value: Color): ColorHex => getOps(value).convert.hex(value),
    css: (value: Color): string => getOps(value).convert.css(value),
  },
}
