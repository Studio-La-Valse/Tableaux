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
      if (this.inputs.find((e) => e.armed)) {
        return
      }

      const result = this.input.payload

      this.onComplete(result)
    } catch (err) {
      console.error(err)
    } finally {
    }
  }

  public abstract onComplete(values: TIn[]): void

  public get inputs(): GraphNodeInput[] {
    return [this.input]
  }
  public get outputs(): GraphNodeOutput[] {
    return []
  }
}
