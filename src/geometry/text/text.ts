import type { Fill } from '../primitives/union/drawable/fill'
import type { Stroke } from '../primitives/union/drawable/stroke'
import type { Font } from './font'

export const textAlignments = ['start', 'end', 'left', 'right', 'center'] as const
export type AlignmentKind = (typeof textAlignments)[number]

export type TextAlignment = {
  align: AlignmentKind
}

export const textBaselines = [
  'top',
  'hanging',
  'middle',
  'alphabetic',
  'ideographic',
  'bottom',
] as const
export type BaselineKind = (typeof textBaselines)[number]

export type TextBaseline = {
  baseline: BaselineKind
}

export const textDirections = ['ltr', 'rtl', 'inherit'] as const
export type DirectionKind = (typeof textDirections)[number]

export type TextDirection = {
  direction: DirectionKind
}

export type TextFormat = Partial<TextAlignment & TextBaseline & TextDirection>

export type Text = {
  x: number
  y: number
  text: string
  fontFamily: Font
  fontSize: number
} & TextFormat & Partial<Fill & Stroke>
