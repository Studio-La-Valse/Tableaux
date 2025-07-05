import type { JsonObject } from './json-object'

export type GraphNodeModel = {
  id: string
  path: string[]
  data: JsonObject | undefined
  x: number
  y: number
  width: number
  height: number
}
