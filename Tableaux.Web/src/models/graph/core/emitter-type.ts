import { Emitter } from './emitter'
import type { Observer } from './observer'
import type { ObserverType } from './observer-type'
import { Subscription, type Unsubscriber } from './subscription'

export class EmitterType<T> extends Emitter {
  private payload: T[] = []
  private _observers: Set<ObserverType<T>> = new Set()

  public get observers(): Observer[] {
    return [...this._observers]
  }

  public subscribe(observer: ObserverType<T>): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this._observers, observer)
    observer.onArm()
    this.payload.forEach((value) => {
      observer.onNext(value)
    })
    observer.onCompleted()
    return subscription
  }

  public override arm(): void {
    this.payload.length = 0
    super.arm()
  }

  public next(value: T): void {
    this.payload.push(value)

    this._observers.forEach((e) => {
      e.onNext(value)
    })
  }
}
