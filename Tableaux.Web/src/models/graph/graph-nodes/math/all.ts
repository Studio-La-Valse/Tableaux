import { GraphNode } from "../../core/graph-node";

export class All extends GraphNode {
    private input1
    private output

    constructor(id: string, path: string[]) {
      super(id, path)

      this.input1 = this.registerBooleanInput()
      this.output = this.registerBooleanOutput()
    }

    protected solve(): void {
      this.output.next(this.input1.payload.every((v) => v))
    }
}
