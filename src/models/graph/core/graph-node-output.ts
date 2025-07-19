import { InvalidObserverTypeError } from './errors/invalid-observer-type-error'
import type { GraphEdge } from './graph-edge'
import type { GraphNode } from './graph-node'
import {
  GraphNodeInputBoolean,
  GraphNodeInputNumber,
  GraphNodeInputObject,
  GraphNodeInputString,
  GraphNodeInputUnknown,
  type GraphNodeInput,
} from './graph-node-input'
import { Subscription } from './subscription'
import type { Unsubscriber } from './unsubscriber'

export abstract class GraphNodeOutput {
  public abstract targetInputs: Set<GraphNodeInput>

  constructor(
    public graphNode: GraphNode,
    public index: number,
    public description: string,
  ) {}

  public connectTo(graphNodeInput: GraphNodeInput): GraphEdge {
    return graphNodeInput.connectTo(this)
  }

  public abstract onSubscribe(graphNodeInput: GraphNodeInput): Unsubscriber

  public trySubscribe(graphNodeId: string): void {
    this.targetInputs.forEach((observer) => {
      observer.onTrySubscribeParent(graphNodeId)
    })
  }

  public abstract arm(): void

  public complete(): void {
    this.targetInputs.forEach((input) => {
      input.onCompleted()
    })
  }
}

export abstract class GraphNodeOutputType<T> extends GraphNodeOutput {
  protected payload: T[] = []

  public override arm(): void {
    this.payload.length = 0
    this.targetInputs.forEach((observer) => {
      observer.onArm()
    })
  }

  public next(value: T): void {
    this.payload.push(value)
  }
}

export class GraphNodeOutputBoolean extends GraphNodeOutputType<boolean> {
  private numberInputs: Set<GraphNodeInputNumber> = new Set<GraphNodeInputNumber>()
  private stringInputs: Set<GraphNodeInputString> = new Set<GraphNodeInputString>()
  private unknownInputs: Set<GraphNodeInputUnknown> = new Set<GraphNodeInputUnknown>()
  private booleanInputs: Set<GraphNodeInputBoolean> = new Set<GraphNodeInputBoolean>()

  public get targetInputs(): Set<GraphNodeInput> {
    return new Set<GraphNodeInput>([
      ...this.numberInputs,
      ...this.stringInputs,
      ...this.unknownInputs,
      ...this.booleanInputs,
    ])
  }

  public onSubscribe(graphNodeInput: GraphNodeInput): Unsubscriber {
    if (graphNodeInput instanceof GraphNodeInputNumber) {
      return this.onSubscribeNumber(graphNodeInput)
    }

    if (graphNodeInput instanceof GraphNodeInputString) {
      return this.onSubscribeString(graphNodeInput)
    }

    if (graphNodeInput instanceof GraphNodeInputUnknown) {
      return this.onSubscribeUnknown(graphNodeInput)
    }

    if (graphNodeInput instanceof GraphNodeInputBoolean) {
      return this.onSubscribeBoolean(graphNodeInput)
    }

    throw new InvalidObserverTypeError()
  }

  public onSubscribeBoolean(graphNodeInput: GraphNodeInputBoolean): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.booleanInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value)
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public onSubscribeNumber(graphNodeInput: GraphNodeInputNumber): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.numberInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value ? 1 : 0)
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public onSubscribeString(graphNodeInput: GraphNodeInputString): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.stringInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value.toString())
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public onSubscribeUnknown(graphNodeInput: GraphNodeInputUnknown): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.unknownInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value)
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public complete(): void {
    for (const value of this.payload) {
      this.booleanInputs.forEach((e) => {
        e.onNext(value)
      })

      this.numberInputs.forEach((e) => {
        e.onNext(value ? 1 : 0)
      })

      this.stringInputs.forEach((e) => {
        e.onNext(value.toString())
      })

      this.unknownInputs.forEach((e) => {
        e.onNext(value)
      })
    }

    super.complete()
  }
}

export class GraphNodeOutputNumber extends GraphNodeOutputType<number> {
  private numberInputs: Set<GraphNodeInputNumber> = new Set<GraphNodeInputNumber>()
  private stringInputs: Set<GraphNodeInputString> = new Set<GraphNodeInputString>()
  private unknownInputs: Set<GraphNodeInputUnknown> = new Set<GraphNodeInputUnknown>()

  public get targetInputs(): Set<GraphNodeInput> {
    return new Set<GraphNodeInput>([
      ...this.numberInputs,
      ...this.stringInputs,
      ...this.unknownInputs,
    ])
  }

  public onSubscribe(graphNodeInput: GraphNodeInput): Unsubscriber {
    if (graphNodeInput instanceof GraphNodeInputNumber) {
      return this.onSubscribeNumber(graphNodeInput)
    }

    if (graphNodeInput instanceof GraphNodeInputString) {
      return this.onSubscribeString(graphNodeInput)
    }

    if (graphNodeInput instanceof GraphNodeInputUnknown) {
      return this.onSubscribeUnknown(graphNodeInput)
    }

    throw new InvalidObserverTypeError()
  }

  public onSubscribeNumber(graphNodeInput: GraphNodeInputNumber): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.numberInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value)
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public onSubscribeString(graphNodeInput: GraphNodeInputString): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.stringInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value.toString())
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public onSubscribeUnknown(graphNodeInput: GraphNodeInputUnknown): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.unknownInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value)
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public complete(): void {
    for (const value of this.payload) {
      this.numberInputs.forEach((e) => {
        e.onNext(value)
      })

      this.stringInputs.forEach((e) => {
        e.onNext(value.toString())
      })

      this.unknownInputs.forEach((e) => {
        e.onNext(value)
      })
    }

    super.complete()
  }
}

export class GraphNodeOutputString extends GraphNodeOutputType<string> {
  private stringInputs: Set<GraphNodeInputString> = new Set<GraphNodeInputString>()
  private unknownInputs: Set<GraphNodeInputUnknown> = new Set<GraphNodeInputUnknown>()

  public get targetInputs(): Set<GraphNodeInput> {
    return new Set<GraphNodeInput>([...this.stringInputs, ...this.unknownInputs])
  }

  public onSubscribe(graphNodeInput: GraphNodeInput): Unsubscriber {
    if (graphNodeInput instanceof GraphNodeInputString) {
      return this.onSubscribeString(graphNodeInput)
    }

    if (graphNodeInput instanceof GraphNodeInputUnknown) {
      return this.onSubscribeUnknown(graphNodeInput)
    }

    throw new InvalidObserverTypeError()
  }

  public onSubscribeString(graphNodeInput: GraphNodeInputString): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.stringInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value.toString())
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public onSubscribeUnknown(graphNodeInput: GraphNodeInputUnknown): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.unknownInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value)
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public complete(): void {
    for (const value of this.payload) {
      this.stringInputs.forEach((e) => {
        e.onNext(value.toString())
      })

      this.unknownInputs.forEach((e) => {
        e.onNext(value)
      })
    }

    super.complete()
  }
}

export class GraphNodeOutputObject extends GraphNodeOutputType<object> {
  private stringInputs: Set<GraphNodeInputString> = new Set<GraphNodeInputString>()
  private objectInputs: Set<GraphNodeInputObject> = new Set<GraphNodeInputObject>()
  private unknownInputs: Set<GraphNodeInputUnknown> = new Set<GraphNodeInputUnknown>()

  public get targetInputs(): Set<GraphNodeInput> {
    return new Set<GraphNodeInput>([
      ...this.stringInputs,
      ...this.objectInputs,
      ...this.unknownInputs,
    ])
  }

  public onSubscribe(graphNodeInput: GraphNodeInput): Unsubscriber {
    if (graphNodeInput instanceof GraphNodeInputString) {
      return this.onSubscribeString(graphNodeInput)
    }

    if (graphNodeInput instanceof GraphNodeInputObject) {
      return this.onSubscribeObject(graphNodeInput)
    }

    if (graphNodeInput instanceof GraphNodeInputUnknown) {
      return this.onSubscribeUnknown(graphNodeInput)
    }

    throw new InvalidObserverTypeError()
  }

  public onSubscribeString(graphNodeInput: GraphNodeInputString): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.stringInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(JSON.stringify(value))
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public onSubscribeObject(graphNodeInput: GraphNodeInputObject): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.objectInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value)
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public onSubscribeUnknown(graphNodeInput: GraphNodeInputUnknown): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.unknownInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value)
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public complete(): void {
    for (const value of this.payload) {
      this.stringInputs.forEach((e) => {
        e.onNext(JSON.stringify(value))
      })

      this.objectInputs.forEach((e) => {
        e.onNext(value)
      })

      this.unknownInputs.forEach((e) => {
        e.onNext(value)
      })
    }

    super.complete()
  }
}

export class GraphNodeOutputUnknown extends GraphNodeOutputType<unknown> {
  private numberInputs: Set<GraphNodeInputNumber> = new Set<GraphNodeInputNumber>()
  private stringInputs: Set<GraphNodeInputString> = new Set<GraphNodeInputString>()
  private unknownInputs: Set<GraphNodeInputUnknown> = new Set<GraphNodeInputUnknown>()
  private objectInputs: Set<GraphNodeInputObject> = new Set<GraphNodeInputObject>()
  private booleanInputs: Set<GraphNodeInputBoolean> = new Set<GraphNodeInputBoolean>()

  public get targetInputs(): Set<GraphNodeInput> {
    return new Set<GraphNodeInput>([
      ...this.numberInputs,
      ...this.stringInputs,
      ...this.unknownInputs,
      ...this.booleanInputs,
      ...this.objectInputs,
    ])
  }

  public onSubscribe(graphNodeInput: GraphNodeInput): Unsubscriber {
    if (graphNodeInput instanceof GraphNodeInputNumber) {
      return this.onSubscribeNumber(graphNodeInput)
    }

    if (graphNodeInput instanceof GraphNodeInputString) {
      return this.onSubscribeString(graphNodeInput)
    }

    if (graphNodeInput instanceof GraphNodeInputUnknown) {
      return this.onSubscribeUnknown(graphNodeInput)
    }

    if (graphNodeInput instanceof GraphNodeInputBoolean) {
      return this.onSubscribeBoolean(graphNodeInput)
    }

    if (graphNodeInput instanceof GraphNodeInputObject) {
      return this.onSubscribeObject(graphNodeInput)
    }

    throw new InvalidObserverTypeError()
  }

  public onSubscribeBoolean(graphNodeInput: GraphNodeInputBoolean): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.booleanInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value as boolean)
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }
  public onSubscribeNumber(graphNodeInput: GraphNodeInputNumber): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.numberInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value as number)
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public onSubscribeString(graphNodeInput: GraphNodeInputString): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.stringInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(this.unkownToString(value))
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public onSubscribeObject(graphNodeInput: GraphNodeInputObject): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.objectInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value as object)
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  public onSubscribeUnknown(graphNodeInput: GraphNodeInputUnknown): Unsubscriber {
    const subscription = Subscription.subscribeOrThrow(this.unknownInputs, graphNodeInput)

    graphNodeInput.onArm()

    this.payload.forEach((value) => {
      graphNodeInput.onNext(value)
    })

    if (this.graphNode.componentState == 'complete') {
      graphNodeInput.onCompleted()
    }

    return subscription
  }

  private unkownToString(value: unknown): string {
    const res = value instanceof Object ? JSON.stringify(value) : (value as string)
    return res
  }

  public complete(): void {
    for (const value of this.payload) {
      this.booleanInputs.forEach((e) => {
        e.onNext(value as boolean)
      })

      this.numberInputs.forEach((e) => {
        e.onNext(value as number)
      })

      this.stringInputs.forEach((e) => {
        e.onNext(this.unkownToString(value))
      })

      this.unknownInputs.forEach((e) => {
        e.onNext(value)
      })
    }

    super.complete()
  }
}
