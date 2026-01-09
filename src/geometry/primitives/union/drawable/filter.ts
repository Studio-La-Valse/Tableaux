import type { ColorARGB } from '@/geometry/color/color'
import type { XY } from '@/geometry/primitives/xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isColorARGB } from '@/geometry/color/color-rgb'
import { isXY } from '@/geometry/primitives/xy'

export type Filter = { blur?: Blur, dropShadow?: DropShadow }

export function hasFilter(object: JsonObject): object is Filter {
  return hasBlur(object) || hasDropShadow(object)
}

export type Blur = {
  size: number
}

export function hasBlur(object: JsonObject): object is { blur: Blur } {
  return (
    typeof object === 'object'
    && object !== null
    && 'blur' in object
    && typeof object.blur === 'object'
    && object.blur !== null
    && 'size' in object.blur
    && typeof object.blur.size === 'number'
  )
}

export type DropShadow = {
  offset: XY
  color: ColorARGB
  size: number
}

export function hasDropShadow(object: JsonObject): object is { dropShadow: DropShadow } {
  return (
    'dropShadow' in object
    && typeof object.dropShadow === 'object'
    && object.dropShadow !== null
    && 'offset' in object.dropShadow
    && isXY(object.dropShadow.offset)
    && 'color' in object.dropShadow
    && isColorARGB(object.dropShadow.color)
    && 'size' in object.dropShadow
    && typeof object.dropShadow.size === 'number'
  )
}
