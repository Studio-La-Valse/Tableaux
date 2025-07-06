import type { GraphEdgeModel } from './models/graph-edge-model'

export class GraphEdge {
  constructor(
    public leftGraphNodeId: string,
    public outputIndex: number,
    public rightGraphNodeId: string,
    public inputIndex: number,
  ) {}

  public createKey(): string {
    const key = `${this.leftGraphNodeId}-${this.outputIndex}-${this.rightGraphNodeId}-${this.inputIndex}`
    return key
  }

  public toModel(): GraphEdgeModel {
    return {
      leftId: this.leftGraphNodeId,
      output: this.outputIndex,
      rightId: this.rightGraphNodeId,
      input: this.inputIndex,
    }
  }
}
