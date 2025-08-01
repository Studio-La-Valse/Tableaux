import { GraphNode } from "../../core/graph-node";
import { inputIterators } from "../../core/input-iterators";
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Or')
export class Or extends GraphNode {
    private input1
    private input2
    private output

    constructor(id: string, path: string[]) {
      super(id, path)

      this.input1 = this.registerBooleanInput("First")
      this.input2 = this.registerBooleanInput("Second")
      this.output = this.registerBooleanOutput("Result")
    }

    protected solve(): void {
      inputIterators
        .cycleValues(this.input1, this.input2)
        .map(([a, b]) =>  a || b)
        .forEach((result) => this.output.next(result))
    }
}
