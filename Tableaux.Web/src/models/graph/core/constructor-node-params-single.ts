import { ConstructorNode } from './constructor-node'
import { GraphNodeInput } from './graph-node-input'
import { ObserverType } from './observer-type'

export abstract class ConstructorNodeParamsSingle<TIn, TOut> extends ConstructorNode<TOut> {
  protected observers: ObserverType<TIn>[]
  protected _inputs: GraphNodeInput[]

  constructor() {
    super()

    this.observers = []
    this._inputs = []

    this.add()
  }

  protected abstract getValue(): TOut[]

  public inputs(): GraphNodeInput[] {
    return [...this._inputs]
  }

  public get numberOfInputs(): number {
    return this._inputs.length
  }
  public numberOfOutputs: number = 1

  public add(): void {
    this.arm()

    const observer = new ObserverType<TIn>(this)
    const input = new GraphNodeInput(this, observer, 0)

    this.observers.push(observer)
    this._inputs.push(input)
  }

  public remove(): void {
    if (this.numberOfInputs <= 1) {
      throw new Error()
    }

    this.arm()

    this._inputs.pop()
    this.observers.pop()

    this.complete()
  }
}
