import type { GraphNode } from './graph-node'
import type { GraphNodeOutput } from './graph-node-output'
import type { JsonObject, JsonValue } from './models/json-value'
import { type Unsubscriber } from './unsubscriber'

export abstract class GraphNodeInput {
  private _subscription: Unsubscriber | undefined
  public get subscription() {
    return this._subscription
  }
  private id: string

  protected _armed: boolean = true
  public get armed() {
    return this._armed
  }

  public abstract get payloadLength(): number

  public get index() {
    return this.graphNode.inputs.findIndex((v) => v.id == this.id)
  }

  constructor(
    public graphNode: GraphNode,
    public description: string,
  ) {
    this.id = crypto.randomUUID()
  }

  // used for params type input.
  public abstract repeat(): GraphNodeInput

  public connectTo(graphNodeOutput: GraphNodeOutput) {
    // will throw an error when cyclical subscription is detected.
    const subscription = graphNodeOutput.onSubscribe(this)

    // subscription succesful, replace the existing subscription
    this.replaceConnection(subscription)
  }

  public replaceConnection(subscription?: Unsubscriber | undefined) {
    this._subscription?.unsubscribe()
    this._subscription = subscription
    if (!this.subscription) this.onArm()
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

  constructor(graphNode: GraphNode, description: string) {
    super(graphNode, description)
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
  public repeat(): GraphNodeInputType<boolean> {
    return new GraphNodeInputBoolean(this.graphNode, this.description)
  }
}

export class GraphNodeInputNumber extends GraphNodeInputType<number> {
  public repeat(): GraphNodeInputType<number> {
    return new GraphNodeInputNumber(this.graphNode, this.description)
  }
}

export class GraphNodeInputString extends GraphNodeInputType<string> {
  public repeat(): GraphNodeInputType<string> {
    return new GraphNodeInputString(this.graphNode, this.description)
  }
}

export class GraphNodeInputObject<T extends JsonObject> extends GraphNodeInputType<T> {
  public repeat(): GraphNodeInputType<T> {
    return new GraphNodeInputObject(this.graphNode, this.description)
  }
}

export class GraphNodeInputUnknown extends GraphNodeInputType<JsonValue> {
  public repeat(): GraphNodeInputType<JsonValue> {
    return new GraphNodeInputUnknown(this.graphNode, this.description)
  }
}
