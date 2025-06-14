import type { Unsubscriber } from './subscription'
import type { Observer } from './observer'

export abstract class Emitter {
  public abstract observers: Observer[]
  public abstract subscribe(observer: Observer): Unsubscriber

  public trySubscribe(componentId: string): void {
    this.observers.forEach((observer) => {
      observer.onTrySubscribeParent(componentId)
    })
  }

  public arm(): void {
    this.observers.forEach((observer) => {
      observer.onArm()
    })
  }

  public complete(): void {
    this.observers.forEach((observer) => {
      observer.onCompleted()
    })
  }
}
