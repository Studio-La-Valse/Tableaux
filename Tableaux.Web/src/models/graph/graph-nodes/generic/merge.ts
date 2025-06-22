import { GraphNode } from '../../core/graph-node'
import type { GraphNodeInputType } from '../../core/graph-node-input'
import type { GraphNodeOutputType } from '../../core/graph-node-output';

export class Merge extends GraphNode {
  private input1: GraphNodeInputType<unknown>;
  private input2: GraphNodeInputType<unknown>;
  private output: GraphNodeOutputType<unknown>;

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerUnkownInput();
    this.input2 = this.registerUnkownInput();
    this.output = this.registerUnkownOutput();
  }

  protected solve(): void {
    this.input1.payload.forEach((value) => {
      this.output.next(value)
    })

    this.input2.payload.forEach((value) => {
      this.output.next(value);
    })
  }
}
