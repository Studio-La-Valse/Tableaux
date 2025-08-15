import type { GraphNode } from './graph-node'
import { type IGraphNodeInput } from './graph-node-input'
import { type JsonObject, type JsonValue } from './models/json-value'
import { Subscription } from './subscription'
import type { Unsubscriber } from './unsubscriber'

export const providerTypes = ['boolean', 'number', 'string', 'object', 'unknown'] as const
export type ProviderType = (typeof providerTypes)[number]

export interface IGraphNodeOutput {
  readonly provides: ProviderType[]
  readonly payloadLength: number

  readonly index: number
  readonly description: string
  readonly graphNodeId: string

  acceptIncoming: (input: IGraphNodeInput) => Unsubscriber
}

export abstract class GraphNodeOutput implements IGraphNodeOutput {
  public targetInputs: Set<IGraphNodeInput> = new Set()

  public get graphNodeId() {
    return this.graphNode.id
  }

  public abstract provides: ProviderType[]
  public abstract payloadLength: number

  constructor(
    private readonly graphNode: GraphNode,
    public readonly index: number,
    public readonly description: string,
  ) {}

  public acceptIncoming(graphNodeInput: IGraphNodeInput) {
    // Create the subscription
    // Will add the input to the provided set
    // Will throw an exception if unsuccesfull
    const subscription = Subscription.subscribeOrThrow(this.targetInputs, graphNodeInput)
    return subscription
  }

  public trySubscribe(graphNodeId: string): void {
    this.targetInputs.forEach((observer) => {
      observer.trySubscribeParent(graphNodeId)
    })
  }

  public abstract arm(): void

  public complete(): void {
    this.targetInputs.forEach((input) => {
      input.complete()
    })
  }
}

export abstract class GraphNodeOutputType<T> extends GraphNodeOutput {
  protected payload: T[] = []

  public override arm(): void {
    this.payload.length = 0
    this.targetInputs.forEach((observer) => {
      observer.arm()
    })
  }

  public next(value: T): void {
    this.payload.push(value)
  }

  public get payloadLength(): number {
    return this.payload.length
  }
}

export abstract class ProvidesBoolean extends GraphNodeOutput {
  abstract provideBoolean(index: number): boolean
}

export function providesBoolean(obj: IGraphNodeOutput): obj is ProvidesBoolean {
  return obj.provides.includes('boolean')
}

export abstract class ProvidesNumber extends GraphNodeOutput {
  abstract provideNumber(index: number): number
}

export function providesNumber(obj: IGraphNodeOutput): obj is ProvidesNumber {
  return obj.provides.includes('number')
}

export abstract class ProvidesString extends GraphNodeOutput {
  abstract provideString(index: number): string
}

export function providesString(obj: IGraphNodeOutput): obj is ProvidesString {
  return obj.provides.includes('string')
}

export abstract class ProvidesObject extends GraphNodeOutput {
  abstract provideObject(index: number): JsonObject
}

export function providesObject(obj: IGraphNodeOutput): obj is ProvidesObject {
  return obj.provides.includes('object')
}

export abstract class ProvidesUnknown extends GraphNodeOutput {
  abstract provideUnknown(index: number): JsonValue
}

export function providesUnknown(obj: IGraphNodeOutput): obj is ProvidesUnknown {
  return obj.provides.includes('unknown')
}

export class GraphNodeOutputBoolean
  extends GraphNodeOutputType<boolean>
  implements ProvidesBoolean, ProvidesNumber, ProvidesString, ProvidesUnknown
{
  override provides = ['boolean', 'number', 'string', 'unknown'] as ProviderType[]

  public provideBoolean(index: number): boolean {
    return this.payload[index]
  }

  public provideNumber(index: number): number {
    return this.payload[index] ? 1 : 0
  }

  public provideString(index: number): string {
    return String(this.payload[index])
  }

  public provideUnknown(index: number): JsonValue {
    return this.payload[index]
  }
}

export class GraphNodeOutputNumber
  extends GraphNodeOutputType<number>
  implements ProvidesNumber, ProvidesString, ProvidesUnknown
{
  override provides = ['number', 'string', 'unknown'] as ProviderType[]

  public provideNumber(index: number): number {
    return this.payload[index]
  }

  public provideString(index: number): string {
    return String(this.payload[index])
  }

  public provideUnknown(index: number): JsonValue {
    return this.payload[index]
  }
}

export class GraphNodeOutputString
  extends GraphNodeOutputType<string>
  implements ProvidesString, ProvidesUnknown
{
  override provides = ['string', 'unknown'] as ProviderType[]

  public provideString(index: number): string {
    return this.payload[index]
  }

  public provideUnknown(index: number): JsonValue {
    return this.payload[index]
  }
}

export class GraphNodeOutputObject<T extends JsonObject>
  extends GraphNodeOutputType<T>
  implements ProvidesString, ProvidesObject, ProvidesUnknown
{
  override provides = ['string', 'object', 'unknown'] as ProviderType[]

  public provideString(index: number): string {
    return JSON.stringify(this.payload[index])
  }

  public provideObject(index: number): JsonObject {
    return this.payload[index]
  }

  public provideUnknown(index: number): JsonValue {
    return this.payload[index]
  }
}

export class GraphNodeOutputUnknown
  extends GraphNodeOutputType<JsonValue>
  implements ProvidesBoolean, ProvidesNumber, ProvidesString, ProvidesObject, ProvidesUnknown
{
  override provides = ['boolean', 'number', 'string', 'object', 'unknown'] as ProviderType[]

  public provideBoolean(index: number): boolean {
    return this.payload[index] as boolean
  }

  public provideNumber(index: number): number {
    return this.payload[index] as number
  }

  public provideString(index: number): string {
    return JSON.stringify(this.payload[index])
  }

  public provideObject(index: number): JsonObject {
    return this.payload[index] as JsonObject
  }

  public provideUnknown(index: number): JsonValue {
    return this.payload[index]
  }
}
