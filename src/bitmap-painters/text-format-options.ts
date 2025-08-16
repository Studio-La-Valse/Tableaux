export const textAlignments = ['start', 'end', 'left', 'right', 'center'] as const
export type AlignmentKind = (typeof textAlignments)[number]

export type TextAlignment = {
  align: AlignmentKind
}

export function hasAlignment(value: object): value is TextAlignment {
  return (
    typeof value === 'object' &&
    value !== null &&
    'align' in value &&
    typeof value.align === 'string' &&
    textAlignments.includes(value.align as AlignmentKind)
  )
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

export function hasBaseLine(value: object): value is TextBaseline {
  return (
    typeof value === 'object' &&
    value !== null &&
    'baseline' in value &&
    typeof value.baseline === 'string' &&
    textBaselines.includes(value.baseline as BaselineKind)
  )
}

export const textDirections = ['ltr', 'rtl', 'inherit'] as const
export type DirectionKind = (typeof textDirections)[number]

export type TextDirection = {
  direction: DirectionKind
}

export function hasDirection(value: object): value is TextDirection {
  return (
    typeof value === 'object' &&
    value !== null &&
    'direction' in value &&
    typeof value.direction === 'string' &&
    textDirections.includes(value.direction as DirectionKind)
  )
}

export type TextFormatOptions = Partial<TextAlignment & TextBaseline & TextDirection>

export function hasTextFormatting(value: object): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    (!('align' in value) || hasAlignment(value)) &&
    (!('baseline' in value) || hasBaseLine(value)) &&
    (!('direction' in value) || hasDirection(value))
  )
}
