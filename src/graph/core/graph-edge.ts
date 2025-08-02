import { nanoid } from 'nanoid'
import type { GraphNodeWrapper } from './graph-node-wrapper'
import type { GraphEdgeModel } from './models/graph-edge-model'

export class GraphEdge {
  public readonly id: string

  constructor(
    public readonly leftGraphNode: GraphNodeWrapper,
    public outputIndex: number,
    public readonly rightGraphNode: GraphNodeWrapper,
    public inputIndex: number,
  ) {
    // used to track selection, note how the public fields may be modified
    this.id = nanoid(11)
  }

  public createKey(): string {
    // used to track during rendering
    const key = `${this.leftGraphNode.innerNode.id}-${this.outputIndex}-${this.rightGraphNode.innerNode.id}-${this.inputIndex}`
    return key
  }

  public toModel(): GraphEdgeModel {
    return {
      leftId: this.leftGraphNode.innerNode.id,
      output: this.outputIndex,
      rightId: this.rightGraphNode.innerNode.id,
      input: this.inputIndex,
    }
  }
}
