import type { GraphNode } from './graph-node'
import type { GraphNodeInput } from './graph-node-input'

export abstract class GraphNodeOutput {
  public abstract targetInputs: Set<GraphNodeInput>

  constructor(
    public graphNode: GraphNode,
    public outputIndex: number,
  ) {}

  public connectTo(graphNodeInput: GraphNodeInput) {
    graphNodeInput.connectTo(this)
  }

  public trySubscribe(graphNodeId: string): void {
    this.targetInputs.forEach((observer) => {
      observer.onTrySubscribeParent(graphNodeId)
    })
  }

  public abstract arm(): void

  public complete(): void {
    this.targetInputs.forEach((input) => {
      input.onCompleted()
    })
  }
}
