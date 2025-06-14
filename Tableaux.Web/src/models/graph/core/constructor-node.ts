import { EmitterType } from './emitter-type'
import { GraphNode } from './graph-node'
import { GraphNodeOutput } from './graph-node-output'

export abstract class ConstructorNode<T> extends GraphNode {
  private _outputs: GraphNodeOutput[]
  private _emitter: EmitterType<T>

  constructor() {
    super()

    this._emitter = new EmitterType<T>()
    this._outputs = [new GraphNodeOutput(this, this._emitter, 0)]
  }

  public override outputs(): GraphNodeOutput[] {
    return this._outputs
  }

  public override outputAt(index: number): GraphNodeOutput {
    return this._outputs[index]
  }

  public override complete(): void {
    try {
      for (const input of this.inputs()) {
        if (input.observer.armed) {
          return
        }
      }

      this.outputs().forEach((e) => {
        e.arm()
      })

      const result = this.getValue()
      result.forEach((r) => {
        this._emitter.next(r)
      })

      this._emitter.complete()
    } catch (err) {
      console.error(err)
    } finally {
    }
  }

  protected abstract getValue(): T[]
}
