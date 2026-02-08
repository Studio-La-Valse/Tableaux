export type StopPosition = number & { readonly brand: unique symbol }

export type GradientStop<TColor> = {
  readonly t: StopPosition
  readonly color: TColor
}

export type Gradient<TColor> = {
  readonly stops: readonly GradientStop<TColor>[]
}

export function makeStopPosition(v: number): StopPosition {
  if (v < 0 || v > 1) {
    throw new RangeError(`StopPosition must be between 0 and 1, got ${v}`)
  }
  return v as StopPosition
}

export function makeGradientStop<TColor>(
  t: number,
  color: TColor,
): GradientStop<TColor> {
  return {
    t: makeStopPosition(t),
    color,
  }
}

export function makeGradient<TColor>(
  stops: readonly GradientStop<TColor>[],
): Gradient<TColor> {
  if (stops.length === 0) {
    throw new Error('Gradient must contain at least one stop')
  }

  for (let i = 1; i < stops.length; i++) {
    if (stops[i].t <= stops[i - 1].t) {
      throw new Error('Gradient stops must be strictly increasing in t')
    }
  }

  return { stops }
}

export function sampleGradient<TColor>(
  gradient: Gradient<TColor>,
  t: number,
  interpolate: (a: TColor, b: TColor, u: number) => TColor,
): TColor {
  if (t < 0 || t > 1) {
    throw new RangeError(`Sample position must be between 0 and 1, got ${t}`)
  }

  const stops = gradient.stops

  if (t <= stops[0].t)
    return stops[0].color
  if (t >= stops[stops.length - 1].t)
    return stops[stops.length - 1].color

  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i]
    const b = stops[i + 1]

    if (t >= a.t && t <= b.t) {
      const u = (t - a.t) / (b.t - a.t)
      return interpolate(a.color, b.color, u)
    }
  }

  // unreachable if invariants hold
  throw new Error('Unreachable: gradient invariant violated')
}

export type ColorFormatter<TColor> = (c: TColor) => string

export function toCanvasGradient<TColor>(
  ctx: CanvasRenderingContext2D,
  gradient: Gradient<TColor>,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  format: ColorFormatter<TColor>,
): CanvasGradient {
  const g = ctx.createLinearGradient(x0, y0, x1, y1)

  for (const stop of gradient.stops) {
    g.addColorStop(stop.t, format(stop.color))
  }

  return g
}
