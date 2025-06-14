import { GraphNode } from './graph-node'
import { GraphNodeOutput } from './graph-node-output'
import { GraphNodeOutputType } from './graph-node-output-type'

export abstract class ConstructorNode<T> extends GraphNode {
  private output: GraphNodeOutputType<T>
  private _outputs: GraphNodeOutput[]

  constructor() {
    super()

    this.output = new GraphNodeOutputType<T>(this, 0)
    this._outputs = [this.output]
  }

  public override get outputs(): GraphNodeOutput[] {
    return this._outputs
  }

  public override outputAt(index: number): GraphNodeOutput {
    return this._outputs[index]
  }

  public override complete(): void {
    try {
      for (const input of this.inputs) {
        if (input.armed) {
          return
        }
      }

      this.outputs.forEach((e) => {
        e.arm()
      })

      const result = this.getValue()
      result.forEach((r) => {
        this.output.next(r)
      })

      this.output.complete()
    } catch (err) {
      console.error(err)
    } finally {
    }
  }

  protected abstract getValue(): T[]
}
