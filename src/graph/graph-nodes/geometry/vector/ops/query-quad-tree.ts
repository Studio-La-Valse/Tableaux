import type { XY } from '@/geometry/primitives/xy'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'

import { xyOps } from '@/geometry/primitives/xy-ops'
import { cast, queryCircle } from '@/geometry/spatial/quad-tree'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../../decorators'

@GraphNodeType('Geometry', 'Spatial', 'Query QuadTree')
export class QuadTreeQuery extends GraphNode {
  private treeInput
  private pointInput
  private distInput

  private pointOutput
  private neighborsOutput

  constructor(modelId: string) {
    super(modelId)

    this.treeInput = this.registerObjectInput('QuadTree').validate(cast)
    this.pointInput = this.registerObjectInput('Point').validate(xyOps.cast)
    this.distInput = this.registerNumberInput('Max Distance')

    // Output the point itself
    this.pointOutput = this.registerObjectOutput<XY>('Point')

    // Output the neighbors as a list
    this.neighborsOutput = this.registerObjectOutput<XY>('Neighbors')
  }

  protected async solve(iterators: InputIteratorsAsync): Promise<void> {
    const [tree] = iterators.singletonOnly(this.treeInput)
    const [maxDist] = iterators.singletonOnly(this.distInput)

    // For each input point, query the tree
    for await (const p of iterators.createGenerator(this.pointInput)) {
      const neighbors: readonly XY[] = queryCircle(tree, p, maxDist)

      // Remove self if present
      const filtered = neighbors.filter(n => n !== p)

      for (const neighbour of filtered) {
        // Output the pair
        this.pointOutput.next(p)
        this.neighborsOutput.next(neighbour)
      }
    }
  }
}
