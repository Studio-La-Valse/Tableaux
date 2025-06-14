import { GraphNode } from './graph-node'
import { GraphNodeInput } from './graph-node-input'
import { GraphNodeInputType } from './graph-node-input-type'
import type { GraphNodeOutput } from './graph-node-output'

export abstract class LeafGraphNode<TIn> extends GraphNode {
  protected input: GraphNodeInputType<TIn>

  constructor() {
    super()

    this.input = new GraphNodeInputType<TIn>(this, 0)
  }

  public complete(): void {
    try {
      for (const input of this.inputs()) {
        if (input.armed) {
          return
        }
      }

      const result = this.input.payload;
      this.onComplete(result)
    } catch (err) {
      console.error(err)
    } finally {
    }
  }

  public abstract onComplete(values: TIn[]): void

  public inputs(): GraphNodeInput[] {
    return [this.input]
  }
  public outputs(): GraphNodeOutput[] {
    return [];
  }
  public inputAt(index: number): GraphNodeInput {
    return this.inputs()[index];
  }
  public outputAt(index: number): GraphNodeOutput {
    return this.outputs()[index];
  }
  public numberOfInputs: number = 1
  public numberOfOutputs: number = 0
}
