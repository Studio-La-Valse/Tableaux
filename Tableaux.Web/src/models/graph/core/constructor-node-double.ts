import { ConstructorNode } from './constructor-node'
import { GraphNodeInput } from './graph-node-input'
import { GraphNodeInputType } from './graph-node-input-type'

export abstract class ConstructorNodeDouble<TIn1, TIn2, TOut> extends ConstructorNode<TOut> {
  protected input1: GraphNodeInputType<TIn1>
  protected input2: GraphNodeInputType<TIn2>

  constructor() {
    super()

    this.input1 = new GraphNodeInputType<TIn1>(this, 0)
    this.input2 = new GraphNodeInputType<TIn2>(this, 1)
  }

  protected abstract getValue(): TOut[]

  public get inputs(): GraphNodeInput[] {
    return [this.input1, this.input2]
  }
}
