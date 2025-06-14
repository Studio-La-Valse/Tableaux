import type { GraphNodeInput } from "./graph-node-input"

export interface Unsubscriber {
  unsubscribe(): void
}

export class Subscription implements Unsubscriber{
  constructor(private inputs: Set<GraphNodeInput>, private observer: GraphNodeInput){

  }

  public unsubscribe(): void {
    this.observer.onArm();
    this.inputs.delete(this.observer);
  }

  public static subscribeOrThrow(alreadyConnectedInputs: Set<GraphNodeInput>, graphNodeOutput: GraphNodeInput): Unsubscriber{
    if (!alreadyConnectedInputs.add(graphNodeOutput)){
      throw new Error("Observer already subscribed.");
    }

    try{
      graphNodeOutput.onTrySubscribeSelf();
    }
    catch (err){
      alreadyConnectedInputs.delete(graphNodeOutput);
      throw err;
    }

    const subscription = new Subscription(alreadyConnectedInputs, graphNodeOutput);
    return subscription;
  }
}
