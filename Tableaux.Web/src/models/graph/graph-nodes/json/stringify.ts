import { GraphNode } from "../../core/graph-node";

export class Stringify extends GraphNode {
    private input
    private output

    constructor(id: string, path: string[]) {
        super(id, path)

        this.input = this.registerObjectInput("JSON")
        this.output = this.registerTextOutput("String")
    }

    protected solve(): void {
        this.input.payload.forEach((v) => this.output.next(JSON.stringify(v)))
    }
}