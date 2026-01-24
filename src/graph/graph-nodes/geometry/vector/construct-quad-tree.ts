import type { XY } from '@/geometry/primitives/xy'
import type { QuadNode } from '@/geometry/spatial/quad-tree'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'

import { rectangleOps } from '@/geometry/primitives/rectangle-ops'
import { xyOps } from '@/geometry/primitives/xy-ops'
import { createQuadRootFromBounds, createQuadRootFromPoints } from '@/geometry/spatial/quad-tree'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Spatial', 'Construct QuadTree')
export class QuadTree extends GraphNode {
  private input
  private capacity
  private bounds
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerObjectInput('Points').validate(xyOps.cast)
    this.capacity = this.registerNumberInput('Capacity')
    this.bounds = this.registerObjectInput('Bounds', [null!])

    this.output = this.registerObjectOutput<QuadNode>('QuadTree')
  }

  protected async solve(iterators: InputIteratorsAsync): Promise<void> {
    const points: XY[] = []

    const [capacity] = iterators.singletonOnly(this.capacity)
    const [bounds] = iterators.singletonOnly(this.bounds)

    // Collect all points from the input stream
    for await (const p of iterators.createGenerator(this.input)) {
      points.push(p)
    }

    // Build quadtree
    let tree
    if (bounds) {
      const rect = rectangleOps.cast(bounds)
      tree = createQuadRootFromBounds(rect, points, capacity)
    }
    else {
      tree = createQuadRootFromPoints(points, capacity)
    }

    // Output the quadtree object
    this.output.next(tree)
  }
}
