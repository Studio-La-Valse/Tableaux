import type { GraphNode } from "./graph-node";
import { Observer } from "./observer";

export class ObserverType<T> extends Observer{
  public payload: T[] = [];

  constructor(graphNode: GraphNode){
    super(graphNode);
  }

  public override onArm(): void {
    this.payload.length = 0;
    super.onArm();
  }

  public onNext(value: T): void{
    this.payload.push(value);
  }
}
