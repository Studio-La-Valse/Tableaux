import type { GraphNodeDescriptor } from './graph-node-descriptor'
import { GraphNodeInput } from './graph-node-input'
import { GraphNodeOutput } from './graph-node-output'

export abstract class GraphNode implements GraphNodeDescriptor {
  public abstract path: string[]
  public id: string

  constructor() {
    this.id = crypto.randomUUID()
  }

  public onInitialize(): void {}

  public trySubscribeSelf(): void {
    this.outputs().forEach((output) => {
      output.trySubscribe(this.id)
    })
  }

  public trySubscribeParent(graphNodeId: string) {
    if (graphNodeId == this.id) {
      console.error("Circular.")
      throw new Error("Circular subscription detected.")
    }

    this.outputs().forEach((output) => {
      output.trySubscribe(graphNodeId)
    })
  }

  public arm(): void {
    this.outputs().forEach((e) => {
      e.arm()
    })
  }

  public abstract complete(): void

  public abstract numberOfInputs: number

  public abstract inputs(): GraphNodeInput[]

  public inputAt(index: number): GraphNodeInput {
    return this.inputs()[index]
  }

  public abstract numberOfOutputs: number

  public abstract outputs(): GraphNodeOutput[]

  public outputAt(index: number): GraphNodeOutput {
    return this.outputs()[index]
  }
}
