import { ObserverAlreadySubscribedError } from './errors/already-subscribed-error'
import type { IGraphNodeInput } from './graph-node-input'
import type { Unsubscriber } from './unsubscriber'

export class Subscription implements Unsubscriber {
  constructor(
    private inputs: Set<IGraphNodeInput>,
    private observer: IGraphNodeInput,
  ) {}

  public unsubscribe(): void {
    this.inputs.delete(this.observer)
  }

  public static subscribeOrThrow(
    alreadyConnectedInputs: Set<IGraphNodeInput>,
    graphNodeOutput: IGraphNodeInput,
  ): Unsubscriber {
    if (!alreadyConnectedInputs.add(graphNodeOutput)) {
      throw new ObserverAlreadySubscribedError()
    }

    try {
      graphNodeOutput.trySubscribeSelf()
    } catch (err) {
      alreadyConnectedInputs.delete(graphNodeOutput)
      throw err
    }

    const subscription = new Subscription(alreadyConnectedInputs, graphNodeOutput)
    return subscription
  }
}
