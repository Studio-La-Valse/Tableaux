import { ObserverAlreadySubscribedError } from './errors/already-subscribed-error'
import type { GraphNodeInput } from './graph-node-input'
import type { Unsubscriber } from './unsubscriber'

export class Subscription implements Unsubscriber {
  constructor(
    private inputs: Set<GraphNodeInput>,
    private observer: GraphNodeInput,
  ) {}

  public unsubscribe(): void {
    this.inputs.delete(this.observer)
  }

  public static subscribeOrThrow(
    alreadyConnectedInputs: Set<GraphNodeInput>,
    graphNodeOutput: GraphNodeInput,
  ): Unsubscriber {
    if (!alreadyConnectedInputs.add(graphNodeOutput)) {
      throw new ObserverAlreadySubscribedError()
    }

    try {
      graphNodeOutput.onTrySubscribeSelf()
    } catch (err) {
      alreadyConnectedInputs.delete(graphNodeOutput)
      throw err
    }

    const subscription = new Subscription(alreadyConnectedInputs, graphNodeOutput)
    return subscription
  }
}
