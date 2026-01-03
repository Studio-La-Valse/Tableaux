import type { GraphNodeInputNumber, GraphNodeInputObject } from '@/graph/core/graph-node-input'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { asGeometryLike } from '@/geometry/drawable/shapes/geometry/geometry-like'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Utils', 'Sample')
export class Sample extends GraphNode {
  private geometry: GraphNodeInputObject
  private N: GraphNodeInputNumber
  private seed: GraphNodeInputNumber

  constructor(modelId: string) {
    super(modelId)

    this.geometry = this.registerObjectInput('Geometry').validate(asGeometryLike)
    this.N = this.registerNumberInput('Number')
    this.seed = this.registerNumberInput('Seed')
  }

  protected async solve(_iterators: InputIteratorsAsync): Promise<void> {
    // for await (const [geometry, n] of iterators.cycleValues(this.geometry, this.N)) {
    //   const pts =
    // }
  }
}
