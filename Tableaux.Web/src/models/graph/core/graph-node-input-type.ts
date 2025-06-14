import type { GraphNode } from './graph-node'
import { GraphNodeInput } from './graph-node-input'
import type { GraphNodeOutputType } from './graph-node-output-type'

export class GraphNodeInputType<T> extends GraphNodeInput {
  public payload: T[] = []

  constructor(graphNode: GraphNode, inputIndex: number) {
    super(graphNode, inputIndex)
  }

  public connectTo(graphNodeOutput: GraphNodeOutputType<T>): void {
    this.closeConnection()

    this.subscription = graphNodeOutput.onSubscribe(this)
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
