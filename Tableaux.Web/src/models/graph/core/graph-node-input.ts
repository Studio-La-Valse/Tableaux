import type { GraphNode } from './graph-node'
import type { GraphNodeOutput } from './graph-node-output'
import type { Observer } from './observer'
import type { Unsubscriber } from './subscription'

export class GraphNodeInput {
  private subscription: Unsubscriber | undefined;

  constructor(
    public graphNode: GraphNode,
    public observer: Observer,
    public inputIndex: number,
  ) {}

  public subscribeTo(graphNodeOutput: GraphNodeOutput): void {
    this.closeConnection();
    this.subscription = graphNodeOutput.subscribe(this);
  }

  public closeConnection(){
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }
}
