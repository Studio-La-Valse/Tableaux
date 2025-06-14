import { ConstructorNode } from './constructor-node'
import { GraphNodeInput } from './graph-node-input'
import { ObserverType } from './observer-type'

export abstract class ConstructorNodeSingle<TIn, TOut> extends ConstructorNode<TOut> {
  protected observer: ObserverType<TIn>
  protected input: GraphNodeInput

  constructor() {
    super()

    this.observer = new ObserverType<TIn>(this)
    this.input = new GraphNodeInput(this, this.observer, 0)
  }

  protected abstract getValue(): TOut[]

  public inputs(): GraphNodeInput[] {
    return [this.input]
  }

  public numberOfInputs: number = 1
  public numberOfOutputs: number = 1
}
