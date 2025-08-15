import { assertIsXY } from '@/geometry/xy'
import { GraphNode } from '@/graph/core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { assertIsGeometry, translate, type Geometry } from '@/geometry/geometry'

@GraphNodeType('Geometry', 'Transform', 'Translate')
export class Translate extends GraphNode {
  private inputGeometry
  private inputOffset

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry').validate(assertIsGeometry)
    this.inputOffset = this.registerObjectInput('Offset').validate(assertIsXY)

    this.outputGeometry = this.registerObjectOutput<Geometry>('Translated Geometry')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom, offset] of inputIterators.cycleValues(
      this.inputGeometry,
      this.inputOffset,
    )) {
      const moved = translate(geom, offset)
      this.outputGeometry.next(moved)
    }
  }
}
