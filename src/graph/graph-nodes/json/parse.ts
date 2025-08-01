import { GraphNode } from "../../core/graph-node";
import { GraphNodeType } from '../decorators'

@GraphNodeType('JSON', 'Parse')
export class Parse extends GraphNode {
    private input
    private output

    constructor(id: string, path: string[]) {
        super(id, path)

        this.input = this.registerStringInput("String")
        this.output = this.registerObjectOutput("JSON")
    }

    protected solve(): void {
        this.input.payload.forEach((v) => this.output.next(JSON.parse(v)))
    }
}
