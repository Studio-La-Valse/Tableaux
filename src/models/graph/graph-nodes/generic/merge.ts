import { GraphNode } from '../../core/graph-node'
import type { GraphNodeInputType } from '../../core/graph-node-input'
import type { GraphNodeOutputType } from '../../core/graph-node-output';
import { GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'Merge')
export class Merge extends GraphNode {
  private params: GraphNodeInputType<unknown>[];
  private output: GraphNodeOutputType<unknown>;

  constructor(id: string, path: string[]) {
    super(id, path)

    this.params = this.registerUnkownInputParams("Values");
    this.output = this.registerUnkownOutput("Values");
  }

  protected solve(): void {
    for (const param of this.params){
      for (const value of param.payload){
        this.output.next(value)
      }
    }
  }
}
