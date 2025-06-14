import type { GraphNode } from './graph-node'
import type { GraphNodeOutput } from './graph-node-output'
import { type Unsubscriber } from './subscription'

export abstract class GraphNodeInput {
  protected subscription: Unsubscriber | undefined

  protected _armed: boolean = true
  public get armed() {
    return this._armed
  }

  constructor(
    public graphNode: GraphNode,
    public inputIndex: number,
  ) {}

  public abstract connectTo(graphNodeOutput: GraphNodeOutput): void

  public closeConnection() {
    this.subscription?.unsubscribe()
    this.subscription = undefined
  }

  public onTrySubscribeSelf(): void {
    this.graphNode.trySubscribeSelf()
  }

  public onTrySubscribeParent(componentId: string): void {
    this.graphNode.trySubscribeParent(componentId)
  }

  public abstract onArm(): void

  public onCompleted(): void {
    this._armed = false
    this.graphNode.complete()
  }
}
