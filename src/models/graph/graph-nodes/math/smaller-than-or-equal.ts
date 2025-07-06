import { GraphNode } from "../../core/graph-node";
import { inputIterators } from "../../core/input-iterators";

export class SmallerThanOrEqual extends GraphNode {
    private input1
    private input2
    private output

    constructor(id: string, path: string[]) {
      super(id, path)

      this.input1 = this.registerNumberInput("First")
      this.input2 = this.registerNumberInput("Second")
      this.output = this.registerBooleanOutput("Values")
    }

    protected solve(): void {
      inputIterators
        .cycleValues(this.input1, this.input2)
        .map(([a, b]) =>  a <= b)
        .forEach((result) => this.output.next(result))
    }
}
