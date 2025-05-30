import type { DrawableElement } from "@/models/drawable-elements/drawable-element";
import type { Disposable } from "./disposable";
import type { Observer } from "./observer";
import type { Observable } from "./observable";

class Unsubscriber implements Disposable{
    constructor(private observers: Set<Observer<DrawableElement>>, private observer: Observer<DrawableElement>){

    }

    dispose(): void {
        this.observers.delete(this.observer);
    }
}

export class ElementDispatcher implements Observable<DrawableElement> {

    private observers: Set<Observer<DrawableElement>>;
    private _queue: Set<DrawableElement>;
    private observables: Set<string>;
    private doneObservables: Set<string>;

    constructor() {
        this.observers = new Set();
        this._queue = new Set();
        this.observables = new Set();
        this.doneObservables = new Set();
    }

    public subscribe(observer: Observer<DrawableElement>): Disposable {
        this.observers.add(observer);
        return new Unsubscriber(this.observers, observer);
    }

    public register(emitterId: string){
        this.observables.add(emitterId)
    }

    public queue(element: DrawableElement): void {
        this._queue.add(element);
    }

    public requestDone(observable: string): void {
        this.doneObservables.add(observable);

        if(this.doneObservables.size == this.observables.size){

            // Notify observers in one pass
            for (const element of this._queue) {
                for (const observer of this.observers) {
                    observer.onNext(element);
                }
            }

            // Complete and clean up after notification
            for (const observer of this.observers) {
                observer.onComplete();
            }

            this.doneObservables.clear();
            this._queue.clear();
        }
    }

    public unregister(emitterId: string): void{
      this.observables.delete(emitterId)
    }
}


