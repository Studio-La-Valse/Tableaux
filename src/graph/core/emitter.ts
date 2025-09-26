import { GraphNode } from './graph-node'
import type { JsonValue } from './models/json-value';

export const emitterKinds = ['number', 'text', 'toggle', 'button', 'range', 'color'] as const

export type EmitterKind = (typeof emitterKinds)[number]

export abstract class Emitter<T extends JsonValue> extends GraphNode {
  public abstract type: EmitterKind

  public override data: { value: T; name: string, hidden: boolean }

  constructor(id: string, path: string[], defaultValue: T) {
    super(id, path)

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
