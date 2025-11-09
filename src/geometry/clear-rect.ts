import type { Rectangle } from './rectangle'
import type { BaseShape } from './shape'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isRectangle } from './rectangle'

export type ClearRectShape = BaseShape & Rectangle & { kind: 'clear-rect' }

export function isClearRectShape(object: JsonObject): object is ClearRectShape {
  return (
    isRectangle(object)
    && 'kind' in object
    && typeof object.kind === 'string'
    && object.kind === 'clear-rect'
  )
}
