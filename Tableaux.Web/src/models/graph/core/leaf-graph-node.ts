import { GraphNode } from './graph-node'
import { GraphNodeInput } from './graph-node-input'
import type { GraphNodeOutput } from './graph-node-output'
import { ObserverType } from './observer-type'

export abstract class LeafGraphNode<TIn> extends GraphNode {
  protected observer: ObserverType<TIn>
  protected input: GraphNodeInput

  constructor() {
    super()

    this.observer = new ObserverType<TIn>(this)
    this.input = new GraphNodeInput(this, this.observer, 0)
  }

  public complete(): void {
    try {
      for (const input of this.inputs()) {
        if (input.observer.armed) {
          return
        }
      }

      const result = this.observer.payload;
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
