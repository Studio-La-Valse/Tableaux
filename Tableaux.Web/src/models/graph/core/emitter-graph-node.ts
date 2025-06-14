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

  public inputs(): GraphNodeInput[] {
    return []
  }

  public inputAt(): GraphNodeInput {
    throw new Error()
  }

  public numberOfInputs: number = 0
  public numberOfOutputs: number = 1
}
