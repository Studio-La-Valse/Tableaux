import { nanoid } from 'nanoid';
import type { GraphNode } from './graph-node';
import type { JsonObject, JsonValue } from './models/json-value';
import { type Unsubscriber } from './unsubscriber';
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
} from './graph-node-output';
import { InvalidObserverTypeError } from './errors/invalid-observer-type-error';

export interface IGraphNodeInput {
  readonly id: string;
  readonly armed: boolean;
  readonly index: number;
  readonly description: string;
  readonly graphNodeId: string;
  readonly isSubscribed: boolean;
  readonly payloadLength: number;

  connectTo: (graphNodeOuput: IGraphNodeOutput) => void;
  unsubscribe: () => void;
  trySubscribeSelf: () => void;
  trySubscribeParent: (id: string) => void;
  arm: () => void;
  complete: () => void;
}

export interface IGraphNodeInputType<T> extends IGraphNodeInput {
  peek: (index: number) => T;
}

export abstract class GraphNodeInput implements IGraphNodeInput {
  public abstract readonly isSubscribed: boolean;
  public abstract readonly payloadLength: number;

  private _id: string;
  public get id() {
    return this._id;
  }

  protected _armed: boolean = true;
  public abstract get armed(): boolean;

  public get graphNodeId() {
    return this.graphNode.id;
  }

  public get index() {
    const index = this.graphNode.inputs.findIndex((v) => v.id == this.id);
    if (index === -1) throw new Error('This input was not found in its parent graph node.');
    return index;
  }

  constructor(
    public readonly graphNode: GraphNode,
    public readonly description: string
  ) {
    this._id = nanoid(11);
  }

  // used for params type input.
  public abstract repeat(): GraphNodeInput;

  // requires type specific logic
  public abstract connectTo(graphNodeOuput: IGraphNodeOutput): void;

  // requires type specific logic
  public abstract unsubscribe(): void;

  public trySubscribeSelf(): void {
    this.graphNode.trySubscribeSelf();
  }

  public trySubscribeParent(componentId: string): void {
    this.graphNode.trySubscribeParent(componentId);
  }

  public arm(): void {
    this._armed = true;
    this.graphNode.arm();
  }

  public complete(): void {
    this._armed = false;
    this.graphNode.complete();
  }
}

export abstract class GraphNodeInputType<T>
  extends GraphNodeInput
  implements IGraphNodeInputType<T>
{
  public abstract readonly payloadLength: number;

  public abstract peek(index: number): T;
}

export abstract class GraphNodeInputSubscriptionType<
  T,
  TOutput extends GraphNodeOutput,
> extends GraphNodeInputType<T> {
  protected subscription: { graphNodeOutput: TOutput; subscription: Unsubscriber } | undefined;

  public get isSubscribed() {
    return this.subscription !== undefined;
  }

  public get armed(): boolean {
    if (!this.isSubscribed) {
      if (this.defaultPayload) {
        return false;
      }

      return true;
    }

    return this._armed;
  }

  public get payloadLength(): number {
    if (!this.subscription) {
      if (this.defaultPayload) {
        return this.defaultPayload.length;
      }

      throw new Error(
        'Input cannot peek because it is not subscribed and does not have a default payload.'
      );
    }

    return this.subscription.graphNodeOutput.payloadLength;
  }

  constructor(
    graphNode: GraphNode,
    description: string,
    public readonly defaultPayload?: T[]
  ) {
    super(graphNode, description);

    if (defaultPayload && defaultPayload.length == 0) {
      throw new Error('A zero length default graph node input payload is not allowed.');
    }
  }

  public connectToOutput(graphNodeOutput: TOutput) {
    const subscription = graphNodeOutput.acceptIncoming(this);
    this.unsubscribe();
    this.subscription = { graphNodeOutput, subscription };
  }

  public unsubscribe(): void {
    this._armed = true;

    if (!this.subscription) return;

    this.subscription.subscription.unsubscribe();
    this.subscription = undefined;
  }
}

export class GraphNodeInputBoolean extends GraphNodeInputSubscriptionType<
  boolean,
  ProvidesBoolean
> {
  constructor(graphNode: GraphNode, description: string, defaultPayload?: boolean[]) {
    super(graphNode, description + ' (Boolean)', defaultPayload);
  }

  public repeat(): GraphNodeInputType<boolean> {
    return new GraphNodeInputBoolean(
      this.graphNode,
      this.description,
      this.defaultPayload ? [...this.defaultPayload] : undefined
    );
  }

  public connectTo(graphNodeOutput: IGraphNodeOutput) {
    if (!providesBoolean(graphNodeOutput)) {
      throw new InvalidObserverTypeError();
    }

    this.connectToOutput(graphNodeOutput);
  }

  public peek(index: number): boolean {
    if (!this.subscription) {
      if (this.defaultPayload) {
        return this.defaultPayload[index];
      }

      throw new Error('Input cannot peek because it is not subscribed.');
    }
    return this.subscription.graphNodeOutput.provideBoolean(index);
  }
}

export class GraphNodeInputNumber extends GraphNodeInputSubscriptionType<number, ProvidesNumber> {
  constructor(graphNode: GraphNode, description: string, defaultPayload?: number[]) {
    super(graphNode, description + ' (Number)', defaultPayload);
  }

  public repeat(): GraphNodeInputType<number> {
    return new GraphNodeInputNumber(
      this.graphNode,
      this.description,
      this.defaultPayload ? [...this.defaultPayload] : undefined
    );
  }

  public connectTo(graphNodeOutput: IGraphNodeOutput) {
    if (!providesNumber(graphNodeOutput)) {
      throw new InvalidObserverTypeError();
    }

    this.connectToOutput(graphNodeOutput);
  }

  public peek(index: number): number {
    if (!this.subscription) {
      if (this.defaultPayload) {
        return this.defaultPayload[index];
      }

      throw new Error('Input cannot peek because it is not subscribed.');
    }
    return this.subscription.graphNodeOutput.provideNumber(index);
  }
}

export class GraphNodeInputString extends GraphNodeInputSubscriptionType<string, ProvidesString> {
  constructor(graphNode: GraphNode, description: string, defaultPayload?: string[]) {
    super(graphNode, description + ' (String)', defaultPayload);
  }

  public repeat(): GraphNodeInputType<string> {
    return new GraphNodeInputString(
      this.graphNode,
      this.description,
      this.defaultPayload ? [...this.defaultPayload] : undefined
    );
  }

  public connectTo(graphNodeOutput: IGraphNodeOutput) {
    if (!providesString(graphNodeOutput)) {
      throw new InvalidObserverTypeError();
    }

    this.connectToOutput(graphNodeOutput);
  }

  public peek(index: number): string {
    if (!this.subscription) {
      if (this.defaultPayload) {
        return this.defaultPayload[index];
      }

      throw new Error('Input cannot peek because it is not subscribed.');
    }
    return this.subscription.graphNodeOutput.provideString(index);
  }
}

export class GraphNodeInputObject extends GraphNodeInputSubscriptionType<
  JsonObject,
  ProvidesObject
> {
  constructor(graphNode: GraphNode, description: string, defaultPayload?: JsonObject[]) {
    super(graphNode, description + ' (Json Object)', defaultPayload);
  }

  public repeat(): GraphNodeInputType<JsonObject> {
    return new GraphNodeInputObject(
      this.graphNode,
      this.description,
      this.defaultPayload ? [...this.defaultPayload] : undefined
    );
  }

  public connectTo(graphNodeOutput: IGraphNodeOutput) {
    if (!providesObject(graphNodeOutput)) {
      throw new InvalidObserverTypeError();
    }

    this.connectToOutput(graphNodeOutput);
  }

  public peek(index: number): JsonObject {
    if (!this.subscription) {
      if (this.defaultPayload) {
        return this.defaultPayload[index];
      }

      throw new Error('Input cannot peek because it is not subscribed.');
    }
    return this.subscription.graphNodeOutput.provideObject(index);
  }

  public validate<T extends JsonObject>(validator: (o: JsonObject) => T) {
    return new GraphNodeInputValidatedObject<T>(this, validator);
  }
}

export class GraphNodeInputValidatedObject<T extends JsonObject> extends GraphNodeInputObject {
  public get id() {
    return this.originalInput.id;
  }

  public get armed() {
    return this.originalInput.armed;
  }

  public get graphNodeId() {
    return this.originalInput.graphNodeId;
  }

  public get index() {
    return this.originalInput.index;
  }

  public get isSubscribed() {
    return this.originalInput.isSubscribed;
  }

  public get payloadLength() {
    return this.originalInput.payloadLength;
  }

  constructor(
    private readonly originalInput: GraphNodeInputObject,
    private readonly validator: (o: JsonObject) => T
  ) {
    super(
      originalInput.graphNode,
      originalInput.description,
      originalInput.defaultPayload ? [...originalInput.defaultPayload] : undefined
    );
  }

  public connectTo(graphNodeOuput: IGraphNodeOutput) {
    return this.originalInput.connectTo(graphNodeOuput);
  }

  public unsubscribe() {
    return this.originalInput.unsubscribe();
  }

  public trySubscribeSelf() {
    return this.originalInput.trySubscribeSelf();
  }

  public trySubscribeParent(componentId: string) {
    return this.originalInput.trySubscribeParent(componentId);
  }

  public arm() {
    return this.originalInput.arm();
  }

  public complete() {
    return this.originalInput.complete();
  }

  public repeat(): GraphNodeInputValidatedObject<T> {
    return new GraphNodeInputValidatedObject(this, this.validator);
  }

  public peek(index: number): T {
    const originalValue = this.originalInput.peek(index);
    const validated = this.validator(originalValue);
    return validated;
  }
}

export class GraphNodeInputUnknown extends GraphNodeInputSubscriptionType<
  JsonValue,
  ProvidesUnknown
> {
  constructor(graphNode: GraphNode, description: string, defaultPayload?: JsonValue[]) {
    super(graphNode, description + ' (Json Value)', defaultPayload);
  }

  public repeat(): GraphNodeInputType<JsonValue> {
    return new GraphNodeInputUnknown(
      this.graphNode,
      this.description,
      this.defaultPayload ? [...this.defaultPayload] : undefined
    );
  }

  public connectTo(graphNodeOutput: IGraphNodeOutput) {
    if (!providesUnknown(graphNodeOutput)) {
      throw new InvalidObserverTypeError();
    }

    this.connectToOutput(graphNodeOutput);
  }

  public peek(index: number): JsonValue {
    if (!this.subscription) {
      if (this.defaultPayload) {
        return this.defaultPayload[index];
      }

      throw new Error('Input cannot peek because it is not subscribed.');
    }
    return this.subscription.graphNodeOutput.provideUnknown(index);
  }
}
