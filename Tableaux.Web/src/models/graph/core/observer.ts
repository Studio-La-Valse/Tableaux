import type { GraphNode } from "./graph-node";

export abstract class Observer{
  private _armed: boolean = true;
  public get armed() { return this._armed };

  constructor(private graphNode: GraphNode){

  }

  public onTrySubscribeSelf(): void{
    this.graphNode.trySubscribeSelf();
  }

  public onTrySubscribeParent(componentId: string): void{
    this.graphNode.trySubscribeParent(componentId)
  }

  public onArm(): void{
    this._armed = true;
    this.graphNode.arm();
  }

  public onCompleted(): void{
    this._armed = false;
    this.graphNode.complete();
  }
}
