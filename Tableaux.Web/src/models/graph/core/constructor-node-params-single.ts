import { ConstructorNode } from './constructor-node'
import { GraphNodeInput } from './graph-node-input'
import { GraphNodeInputType } from './graph-node-input-type'

export abstract class ConstructorNodeParamsSingle<TIn, TOut> extends ConstructorNode<TOut> {
  protected _inputs: GraphNodeInputType<TIn>[]

  constructor() {
    super()

    this._inputs = []

    this.add()
  }

  protected abstract getValue(): TOut[]

  public get inputs(): GraphNodeInput[] {
    return [...this._inputs]
  }

  public add(): void {
    this.arm()

    const input = new GraphNodeInputType<TIn>(this, 0)
    this._inputs.push(input)
  }

  public remove(): void {
    if (this.numberOfInputs <= 1) {
      throw new Error()
    }

    this.arm()

    this._inputs.pop()
  }
}
