import { GraphEdge } from './graph-edge'
import type { GraphNode } from './graph-node'
import { GraphNodeInput } from './graph-node-input'
import type { GraphNodeOutputType } from './graph-node-output-type'

export class GraphNodeInputType<T> extends GraphNodeInput {
  public payload: T[] = []

  constructor(graphNode: GraphNode, inputIndex: number) {
    super(graphNode, inputIndex)
  }

  public connectTo(graphNodeOutput: GraphNodeOutputType<T>): GraphEdge {
    this.closeConnection()

    this.subscription = graphNodeOutput.onSubscribe(this)
    const edge = new GraphEdge(
      graphNodeOutput.graphNode.id,
      graphNodeOutput.outputIndex,
      this.graphNode.id,
      this.inputIndex,
    )
    return edge
  }

  public override onArm(): void {
    this.payload.length = 0
    this._armed = true
    this.graphNode.arm()
  }

  public onNext(value: T): void {
    this.payload.push(value)
  }
}
