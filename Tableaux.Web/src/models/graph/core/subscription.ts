import type { ObserverType } from "./observer-type";

export interface Unsubscriber {
  unsubscribe(): void
}

export class Subscription<T> implements Unsubscriber{
  constructor(private observers: Set<ObserverType<T>>, private observer: ObserverType<T>){

  }

  public unsubscribe(): void {
    this.observer.onArm();
    this.observers.delete(this.observer);
  }

  public static subscribeOrThrow<T>(observers: Set<ObserverType<T>>, observer: ObserverType<T>): Unsubscriber{
    if (!observers.add(observer)){
      throw new Error("Observer already subscribed.");
    }

    try{
      observer.onTrySubscribeSelf();
    }
    catch (err){
      observers.delete(observer);
      throw err;
    }

    const subscription = new Subscription<T>(observers, observer);
    return subscription;
  }
}
