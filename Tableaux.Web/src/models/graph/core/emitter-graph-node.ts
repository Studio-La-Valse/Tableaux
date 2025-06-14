import { ConstructorNode } from './constructor-node'
import type { GraphNodeInput } from './graph-node-input'

export abstract class EmitterGraphNode<T> extends ConstructorNode<T> {
  private _payload: T[] = []

  public next(value: T) {
    this._payload.push(value)
  }

  protected override getValue(): T[] {
    return this._payload
  }

  override arm(): void {
    this._payload.length = 0
    super.arm()
  }

  public get inputs(): GraphNodeInput[] {
    return []
  }

  public inputAt(): GraphNodeInput {
    throw new Error()
  }
}
