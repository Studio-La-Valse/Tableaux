import type { IntRange } from './int-range'

export const ALPHA_MAX = 255

export type Alpha = IntRange<0, 256>

export function isAlpha(n: number): n is Alpha {
  return n >= 0 && n <= 255
}

export function clamp(n: number): Alpha {
  if (n <= 0)
    return 0 as Alpha
  if (n >= 255)
    return 255 as Alpha
  return n as Alpha
}
