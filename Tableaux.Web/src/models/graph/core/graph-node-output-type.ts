import type { GraphNodeInputType } from './graph-node-input-type'
import { GraphNodeOutput } from './graph-node-output'
import { Subscription, type Unsubscriber } from './subscription'

export class GraphNodeOutputType<T> extends GraphNodeOutput {
  private payload: T[] = []
  public targetInputs: Set<GraphNodeInputType<T>> = new Set()

  public override arm(): void {
    this.payload.length = 0
    this.targetInputs.forEach((observer) => {
      observer.onArm()
    })
  }

  public next(value: T): void {
    this.payload.push(value)

    this.targetInputs.forEach((e) => {
      e.onNext(value)
    })
  }

  public onSubscribe(graphNodeInput: GraphNodeInputType<T>): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.targetInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value)
    })

    return subscription
  }
}
