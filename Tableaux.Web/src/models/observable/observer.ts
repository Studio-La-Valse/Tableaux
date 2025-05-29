export interface Observer<T>{
    onNext(element: T): void;
    onError(error: Error): void;
    onComplete(): void;
}