import { GraphNodeInput } from './graph-node-input'
import { GraphNodeOutput } from './graph-node-output'

export abstract class GraphNode {
  public abstract path: string[]
  public id: string

  public width: number = 150
  public heigth: number = 50
  public x: number = 0
  public y: number = 0

  constructor() {
    this.id = crypto.randomUUID()
  }

  public onInitialize(): void {}

  public trySubscribeSelf(): void {
    this.outputs.forEach((output) => {
      output.trySubscribe(this.id)
    })
  }

  public trySubscribeParent(graphNodeId: string) {
    if (graphNodeId == this.id) {
      const msg = `Circular subscription detected for graph node ${graphNodeId}.`
      throw new Error(msg)
    }

    this.outputs.forEach((output) => {
      output.trySubscribe(graphNodeId)
    })
  }

  public arm(): void {
    this.outputs.forEach(e => e.arm())
  }

  public abstract complete(): void

  public abstract inputs: GraphNodeInput[]

  public get numberOfInputs(): number {
    return this.inputs.length
  }

  public inputAt(index: number): GraphNodeInput {
    return this.inputs[index]
  }

  public abstract outputs: GraphNodeOutput[]

  public get numberOfOutputs(): number {
    return this.outputs.length
  }

  public outputAt(index: number): GraphNodeOutput {
    return this.outputs[index]
  }
}
