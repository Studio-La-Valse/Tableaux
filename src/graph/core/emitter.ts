import type { JsonValue } from './models/json-value'
import { GraphNode } from './graph-node'

export const emitterKinds = ['number', 'text', 'toggle', 'button', 'range', 'color'] as const

export type EmitterKind = (typeof emitterKinds)[number]

export abstract class Emitter<T extends JsonValue> extends GraphNode {
  public abstract type: EmitterKind

  public override data: {
    value: T
    name: string
    hidden: boolean
    order?: number
  }

  constructor(modelId: string, defaultValue: T) {
    super(modelId)

    this.data = { value: defaultValue, name: '', hidden: false }
  }

  public onChange(newValue: T): void {
    this.arm()
    this.data.value = newValue
    this.complete()
  }

  public assignName(name: string): void {
    this.data.name = name
  }
}
