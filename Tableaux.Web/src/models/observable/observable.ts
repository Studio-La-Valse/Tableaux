import type { Disposable } from "./disposable";
import type { Observer } from "./observer";

export interface Observable<T>{
    subscribe(observer: Observer<T>): Disposable;
}
