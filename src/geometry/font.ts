export type Font = {
  postscriptName?: string
  fullName?: string
  family: string
  style?: string
}

export function isFont(value: unknown): value is Font {

}

export function assertIsFont(value: unknown): Font {
  
}
