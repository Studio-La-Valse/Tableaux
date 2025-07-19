import { GraphNode } from '../../core/graph-node'
import type { GraphNodeInputType } from '../../core/graph-node-input'
import type { GraphNodeOutputType } from '../../core/graph-node-output';

export class Merge extends GraphNode {
  private params: GraphNodeInputType<unknown>[];
  private output: GraphNodeOutputType<unknown>;

  constructor(id: string, path: string[]) {
    super(id, path)

    this.params = this.registerUnkownInputParams("Values");
    this.output = this.registerUnkownOutput("Values");
  }

  protected solve(): void {
    this.params.forEach((i) => {
      i.payload.forEach((v) => {
        this.output.next(v);
      })
    })
  }
}
