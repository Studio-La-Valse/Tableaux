import type { Rectangle } from '@/geometry/primitives/rectangle'
import type { XY } from '@/geometry/primitives/xy'

import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { breadthFirst, cast, isQuadLeaf } from '@/geometry/spatial/quad-tree'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Spatial', 'Deconstruct QuadTree')
export class DeconstructQuadTree extends GraphNode {
  private treeInput

  private rectOutput
  private pointOutput

  constructor(modelId: string) {
    super(modelId)

    this.treeInput = this.registerObjectInput('QuadTree').validate(cast)

    this.rectOutput = this.registerObjectOutput<Rectangle>('Rectangles')
    this.pointOutput = this.registerObjectOutput<XY>('Points')
  }

  protected async solve(iterators: InputIteratorsAsync): Promise<void> {
    const [tree] = iterators.singletonOnly(this.treeInput)
    if (!tree)
      return

    // Traverse the tree and emit rectangles + points
    breadthFirst(tree).forEach((node) => {
      // Emit the rectangle for this node
      this.rectOutput.next({
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
      })

      // Emit points if this is a leaf
      if (isQuadLeaf(node)) {
        for (const p of node.points) {
          this.pointOutput.next(p)
        }
      }
    })
  }
}
