import { nanoid } from 'nanoid'
import type { IGraphNodeWrapper } from './graph-node-wrapper'
import type { GraphEdgeModel } from './models/graph-edge-model'

export class GraphEdge {
  public readonly id: string

  constructor(
    public readonly leftGraphNode: IGraphNodeWrapper,
    public outputIndex: number,
    public readonly rightGraphNode: IGraphNodeWrapper,
    public inputIndex: number,
  ) {
    // used to track selection, note how the public fields may be modified
    this.id = nanoid(11)
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
