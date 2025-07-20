import { GraphNode } from "../../core/graph-node";
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'All')
export class All extends GraphNode {
    private input1
    private output

    constructor(id: string, path: string[]) {
      super(id, path)

      this.input1 = this.registerBooleanInput("Values")
      this.output = this.registerBooleanOutput("All")
    }

    protected solve(): void {
      this.output.next(this.input1.payload.every((v) => v))
    }
}
