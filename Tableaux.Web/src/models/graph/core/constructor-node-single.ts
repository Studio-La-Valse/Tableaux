import { ConstructorNode } from './constructor-node'
import { GraphNodeInput } from './graph-node-input'
import { GraphNodeInputType } from './graph-node-input-type'

export abstract class ConstructorNodeSingle<TIn, TOut> extends ConstructorNode<TOut> {
  protected input: GraphNodeInputType<TIn>

  constructor() {
    super()

    this.input = new GraphNodeInputType<TIn>(this, 0)
  }

  protected abstract getValue(): TOut[]

  public get inputs(): GraphNodeInput[] {
    return [this.input]
  }
}
