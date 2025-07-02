import { GraphNode } from "../../core/graph-node";

export class Parse extends GraphNode {
    private input
    private output

    constructor(id: string, path: string[]) {
        super(id, path)

        this.input = this.registerStringInput()
        this.output = this.registerObjectOutput()
    }

    protected solve(): void {
        this.input.payload.forEach((v) => this.output.next(JSON.parse(v)))
    }
}