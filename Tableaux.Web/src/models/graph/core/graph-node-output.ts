import type { GraphNode } from './graph-node'
import type { Emitter } from './emitter'
import type { GraphNodeInput } from './graph-node-input'
import type { Unsubscriber } from './subscription'

export class GraphNodeOutput {
  constructor(
    public graphNode: GraphNode,
    public observable: Emitter,
    public outputIndex: number,
  ) {}

  public subscribe(graphNodeInput: GraphNodeInput): Unsubscriber {
    const unsubscriber = this.observable.subscribe(graphNodeInput.observer)
    return unsubscriber;
  }

  public trySubscribe(graphId: string): void {
    this.observable.trySubscribe(graphId)
  }

  public arm(): void {
    this.observable.arm()
  }
}
