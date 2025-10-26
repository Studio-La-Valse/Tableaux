import type { JsonObject } from '@/graph/core/models/json-value';
import type { BaseShape } from '../geometry/shape';
import { isXY, type XY } from '../geometry/xy';
import { isFont, type Font } from './font';

export const textAlignments = ['start', 'end', 'left', 'right', 'center'] as const;
export type AlignmentKind = (typeof textAlignments)[number];

export type TextAlignment = {
  align: AlignmentKind;
};

export const textBaselines = [
  'top',
  'hanging',
  'middle',
  'alphabetic',
  'ideographic',
  'bottom',
] as const;
export type BaselineKind = (typeof textBaselines)[number];

export type TextBaseline = {
  baseline: BaselineKind;
};

export const textDirections = ['ltr', 'rtl', 'inherit'] as const;
export type DirectionKind = (typeof textDirections)[number];

export type TextDirection = {
  direction: DirectionKind;
};

export type TextFormat = Partial<TextAlignment & TextBaseline & TextDirection>;

export type Text = {
  x: number;
  y: number;
  text: string;
  fontFamily: Font;
  fontSize: number;
};

export function isText(object: JsonObject): object is Text {
  return (
    isXY(object) &&
    'text' in object &&
    typeof object.text === 'string' &&
    'fontFamily' in object &&
    isFont(object.fontFamily) &&
    'fontSize' in object &&
    typeof object.fontSize === 'number'
  );
}

export type TextShape = BaseShape & {
  kind: 'text';
} & Text &
  TextFormat;

export function isTextShape(object: JsonObject): object is TextShape {
  return (
    isText(object) && 'kind' in object && typeof object.kind === 'string' && object.kind === 'text'
  );
}

export function asTextShape(object: JsonObject): TextShape {
  if (isText(object)) {
    return {
      ...object,
      kind: 'text',
    };
  }

  throw Error('Object could not be cast to text shape');
}

export const createText = (
  text: string,
  origin: XY,
  fontFamily: Font,
  fontSize: number
): TextShape => {
  return {
    kind: 'text',
    text,
    ...origin,
    fontFamily,
    fontSize,
  };
};
