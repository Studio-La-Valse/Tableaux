import type { ColorARGB } from '@/geometry/color';
import { formatCSSRGBA, isColorARGB } from '@/geometry/color-rgb';
import { isXY, type XY } from '@/geometry/xy';
import type { Shape } from './shape';

export type Filter = { blur?: Blur; dropShadow?: DropShadow };

export function hasFilter(shape: Shape): shape is Shape & Filter {
  return hasBlur(shape) || hasDropShadow(shape);
}

export function formatCtxFilter(filter: Filter): string {
  const parts: string[] = [];

  if (filter.blur) {
    parts.push(`blur(${filter.blur.size}px)`);
  }

  if (filter.dropShadow) {
    const { offset, color, size } = filter.dropShadow;
    const cssArgb = formatCSSRGBA(color);
    parts.push(`drop-shadow(${offset.x}px ${offset.y}px ${size}px ${cssArgb})`);
  }

  return parts.join(' ');
}

export type Blur = {
  size: number;
};

export function hasBlur(object: Shape): object is Shape & { blur: Blur } {
  return (
    typeof object === 'object' &&
    object !== null &&
    'blur' in object &&
    typeof object.blur === 'object' &&
    object.blur !== null &&
    'size' in object.blur &&
    typeof object.blur.size === 'number'
  );
}

export function applyBlur(shape: Shape, size: number): Shape & { blur: Blur } {
  const blur = { size };
  return { ...shape, blur };
}

export type DropShadow = {
  offset: XY;
  color: ColorARGB;
  size: number;
};

export function hasDropShadow(object: Shape): object is Shape & { dropShadow: DropShadow } {
  return (
    'dropShadow' in object &&
    typeof object.dropShadow === 'object' &&
    object.dropShadow !== null &&
    'offset' in object.dropShadow &&
    isXY(object.dropShadow.offset) &&
    'color' in object.dropShadow &&
    isColorARGB(object.dropShadow.color) &&
    'size' in object.dropShadow &&
    typeof object.dropShadow.size === 'number'
  );
}

export function applyDropShadow(
  shape: Shape,
  offset: XY,
  color: ColorARGB,
  size: number,
): Shape & { dropShadow: DropShadow } {
  const dropShadow = { offset, color, size };
  return { ...shape, dropShadow };
}
