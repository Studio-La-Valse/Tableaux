import { ConstructorNode } from './constructor-node'
import { GraphNodeInput } from './graph-node-input'
import { ObserverType } from './observer-type'

export abstract class ConstructorNodeDouble<TIn1, TIn2, TOut> extends ConstructorNode<TOut> {
  protected observer1: ObserverType<TIn1>
  protected observer2: ObserverType<TIn2>
  protected input1: GraphNodeInput
  protected input2: GraphNodeInput

  constructor() {
    super()

    this.observer1 = new ObserverType<TIn1>(this)
    this.observer2 = new ObserverType<TIn2>(this)

    this.input1 = new GraphNodeInput(this, this.observer1, 0)
    this.input2 = new GraphNodeInput(this, this.observer2, 1)
  }

  protected abstract getValue(): TOut[]

  public inputs(): GraphNodeInput[] {
    return [this.input1, this.input2]
  }

  public numberOfInputs: number = 2
  public numberOfOutputs: number = 1
}
