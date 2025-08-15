export type Font = {
  postscriptName?: string
  fullName?: string
  family: string
  style?: string
}

export function isFont(value: unknown): value is Font {
  return (
    typeof value === 'object' &&
    value !== null &&
    'family' in value &&
    typeof value.family === 'string'
  )
}

export function assertIsFont(value: unknown): Font {
  if (!isFont(value)) {
    throw new Error("Provided value is not a font.")
  }

  return value
}

export function formatCtx(value: Font, size: number): string {
  const fontName = `${value.style?.toLocaleLowerCase()} ${size}px ${value.postscriptName ?? value.fullName ?? value.family}`
  return fontName
}
