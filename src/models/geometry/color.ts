export type ColorHex = `#${string}`

export type ColorRGB = { r: number; g: number; b: number }
export type ColorARGB = { a: number } & ColorRGB

export type ColorHSL = { h: number; s: number; l: number }
export type ColorAHSL = { a: number } & ColorHSL

export type ColorHSV = { h: number; s: number; v: number }
export type ColorAHSV = { a: number } & ColorHSV

export type Color = ColorHex | ColorRGB | ColorARGB
