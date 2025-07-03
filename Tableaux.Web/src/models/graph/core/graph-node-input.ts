import { GraphEdge } from './graph-edge'
import type { GraphNode } from './graph-node'
import type { GraphNodeOutput } from './graph-node-output'
import { type Unsubscriber } from './unsubscriber'

export abstract class GraphNodeInput {
  protected subscription: Unsubscriber | undefined

  protected _armed: boolean = true
  public get armed() {
    return this._armed
  }

  public abstract get payloadLength(): number

  constructor(
    public graphNode: GraphNode,
    public index: number,
    public description: string
  ) { }

  public connectTo(graphNodeOutput: GraphNodeOutput): GraphEdge {
    // will throw an error when cyclical subscription is detected.
    const subscription = graphNodeOutput.onSubscribe(this)

    // subscription succesful, replace the existing subscription
    this.replaceConnection(subscription)

    // create a description of the new connection
    const edge = new GraphEdge(
      graphNodeOutput.graphNode.id,
      graphNodeOutput.index,
      this.graphNode.id,
      this.index,
    )
    return edge
  }

  public replaceConnection(subscription: Unsubscriber | undefined) {
    this.subscription?.unsubscribe()
    this.subscription = subscription
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

export abstract class GraphNodeInputType<T> extends GraphNodeInput {
  public payload: T[] = []

  public get payloadLength(): number {
    return this.payload.length
  }

  constructor(graphNode: GraphNode, inputIndex: number,
    public description: string) {
    super(graphNode, inputIndex, description)
  }

  public override onArm(): void {
    this.payload.length = 0
    this._armed = true
    this.graphNode.arm()
  }

  public onNext(value: T): void {
    this.payload.push(value)
  }
}

export class GraphNodeInputBoolean extends GraphNodeInputType<boolean> {

}

export class GraphNodeInputNumber extends GraphNodeInputType<number> {

}

export class GraphNodeInputString extends GraphNodeInputType<string> {

}

export class GraphNodeInputObject extends GraphNodeInputType<object> {

}

export class GraphNodeInputUnkown extends GraphNodeInputType<unknown> {

}
