import type { GraphNode } from './graph-node'
import type { Emitter } from './emitter'
import type { GraphNodeInput } from './graph-node-input'
import type { Unsubscriber } from './subscription'

export class GraphNodeOutput {
  constructor(
    public graphNode: GraphNode,
    public emitter: Emitter,
    public outputIndex: number,
  ) {}

  public subscribe(graphNodeInput: GraphNodeInput): Unsubscriber {
    const unsubscriber = this.emitter.subscribe(graphNodeInput.observer)
    return unsubscriber;
  }

  public trySubscribe(graphId: string): void {
    this.emitter.trySubscribe(graphId)
  }

  public arm(): void {
    this.emitter.arm()
  }
}
