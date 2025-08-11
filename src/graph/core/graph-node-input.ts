import { nanoid } from 'nanoid'
import type { GraphNode } from './graph-node'
import type { JsonObject, JsonValue } from './models/json-value'
import { type Unsubscriber } from './unsubscriber'
import {
  GraphNodeOutput,
  type IGraphNodeOutput,
  providesBoolean,
  ProvidesBoolean,
  providesNumber,
  ProvidesNumber,
  providesObject,
  ProvidesObject,
  providesString,
  ProvidesString,
  providesUnknown,
  ProvidesUnknown,
} from './graph-node-output'
import { InvalidObserverTypeError } from './errors/invalid-observer-type-error'

export interface IGraphNodeInput {
  readonly index: number
  readonly description: string
  readonly graphNodeId: string
  readonly isSubscribed: boolean
  readonly payloadLength: number

  connectTo: (graphNodeOuput: IGraphNodeOutput) => void
  unsubscribe: () => void
  trySubscribeSelf: () => void
  trySubscribeParent: (id: string) => void
  arm: () => void
  complete: () => void
}

export interface IGraphNodeInputType<T> extends IGraphNodeInput {
  peek: (index: number) => T
}

export abstract class GraphNodeInput implements IGraphNodeInput {
  private _id: string
  protected _armed: boolean = true

  public abstract readonly isSubscribed: boolean
  public abstract readonly payloadLength: number

  public get graphNodeId() {
    return this.graphNode.id
  }

  public abstract readonly armed: boolean;

  public get index() {
    return this.graphNode.inputs.findIndex((v) => v._id == this._id)
  }

  constructor(
    protected readonly graphNode: GraphNode,
    public description: string,
  ) {
    this._id = nanoid(11)
  }

  // used for params type input.
  public abstract repeat(): GraphNodeInput

  // requires type specific logic
  public abstract connectTo(graphNodeOuput: IGraphNodeOutput): void

  // requires type specific logic
  public abstract unsubscribe(): void

  public trySubscribeSelf(): void {
    this.graphNode.trySubscribeSelf()
  }

  public trySubscribeParent(componentId: string): void {
    this.graphNode.trySubscribeParent(componentId)
  }

  public arm(): void {
    this._armed = true
    this.graphNode.arm()
  }

  public complete(): void {
    // cannot complete yet, we are not subscribed!
    if (!this.isSubscribed) return

    this._armed = false
    this.graphNode.complete()
  }
}

export abstract class GraphNodeInputType<T>
  extends GraphNodeInput
  implements IGraphNodeInputType<T>
{
  public abstract readonly payloadLength: number

  public abstract peek(index: number): T
}

export abstract class GraphNodeInputSubscriptionType<
  T,
  TOutput extends GraphNodeOutput,
> extends GraphNodeInputType<T> {
  protected subscription: { graphNodeOutput: TOutput; subscription: Unsubscriber } | undefined
  public get isSubscribed() {
    return this.subscription !== undefined
  }

  public get armed() {
    return this._armed || this.subscription === undefined
  }


  public get payloadLength(): number {
    if (!this.subscription) {
      throw new Error('Input cannot peek because it is not subscribed.')
    }

    return this.subscription.graphNodeOutput.payloadLength
  }

  public connectToOutput(graphNodeOutput: TOutput) {
    const subscription = graphNodeOutput.acceptIncoming(this)
    this.unsubscribe()
    this.subscription = { graphNodeOutput, subscription }
  }

  public unsubscribe(): void {
    this._armed = true

    if (!this.subscription) return

    this.subscription.subscription.unsubscribe()
    this.subscription = undefined
  }
}

export class GraphNodeInputBoolean extends GraphNodeInputSubscriptionType<
  boolean,
  ProvidesBoolean
> {
  public repeat(): GraphNodeInputType<boolean> {
    return new GraphNodeInputBoolean(this.graphNode, this.description)
  }

  public connectTo(graphNodeOutput: IGraphNodeOutput) {
    if (!providesBoolean(graphNodeOutput)) {
      throw new InvalidObserverTypeError()
    }

    this.connectToOutput(graphNodeOutput)
  }

  public peek(index: number): boolean {
    if (!this.subscription) {
      throw new Error('Input cannot peek because it is not subscribed.')
    }
    return this.subscription.graphNodeOutput.provideBoolean(index)
  }
}

export class GraphNodeInputNumber extends GraphNodeInputSubscriptionType<number, ProvidesNumber> {
  public repeat(): GraphNodeInputType<number> {
    return new GraphNodeInputNumber(this.graphNode, this.description)
  }

  public connectTo(graphNodeOutput: IGraphNodeOutput) {
    if (!providesNumber(graphNodeOutput)) {
      throw new InvalidObserverTypeError()
    }

    this.connectToOutput(graphNodeOutput)
  }

  public peek(index: number): number {
    if (!this.subscription) {
      throw new Error('Input cannot peek because it is not subscribed.')
    }
    return this.subscription.graphNodeOutput.provideNumber(index)
  }
}

export class GraphNodeInputString extends GraphNodeInputSubscriptionType<string, ProvidesString> {
  public repeat(): GraphNodeInputType<string> {
    return new GraphNodeInputString(this.graphNode, this.description)
  }

  public connectTo(graphNodeOutput: IGraphNodeOutput) {
    if (!providesString(graphNodeOutput)) {
      throw new InvalidObserverTypeError()
    }

    this.connectToOutput(graphNodeOutput)
  }

  public peek(index: number): string {
    if (!this.subscription) {
      throw new Error('Input cannot peek because it is not subscribed.')
    }
    return this.subscription.graphNodeOutput.provideString(index)
  }
}

export class GraphNodeInputObject extends GraphNodeInputSubscriptionType<
  JsonObject,
  ProvidesObject
> {
  public repeat(): GraphNodeInputType<JsonObject> {
    return new GraphNodeInputObject(this.graphNode, this.description)
  }

  public connectTo(graphNodeOutput: IGraphNodeOutput) {
    if (!providesObject(graphNodeOutput)) {
      throw new InvalidObserverTypeError()
    }

    this.connectToOutput(graphNodeOutput)
  }

  public peek(index: number): JsonObject {
    if (!this.subscription) {
      throw new Error('Input cannot peek because it is not subscribed.')
    }
    return this.subscription.graphNodeOutput.provideObject(index)
  }
}

export class GraphNodeInputUnknown extends GraphNodeInputSubscriptionType<
  JsonValue,
  ProvidesUnknown
> {
  public repeat(): GraphNodeInputType<JsonValue> {
    return new GraphNodeInputUnknown(this.graphNode, this.description)
  }

  public connectTo(graphNodeOutput: IGraphNodeOutput) {
    if (!providesUnknown(graphNodeOutput)) {
      throw new InvalidObserverTypeError()
    }

    this.connectToOutput(graphNodeOutput)
  }

  public peek(index: number): JsonValue {
    if (!this.subscription) {
      throw new Error('Input cannot peek because it is not subscribed.')
    }
    return this.subscription.graphNodeOutput.provideUnknown(index)
  }
}
