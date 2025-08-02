import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { assertIsShape, dividen } from '@/geometry/shape'
import type { XY } from '@/geometry/xy'

@GraphNodeType('Geometry', 'Analyze', 'Divide N')
export class Translate extends GraphNode {
  private inputGeometry
  private inputN

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')
    this.inputN = this.registerNumberInput('Number')

    this.outputGeometry = this.registerObjectOutput<XY>('Translated Geometry')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputGeometry, this.inputN).forEach(([_geom, n]) => {
      const geom = assertIsShape(_geom)
      const result = dividen(geom, n)

      result.forEach((v) => this.outputGeometry.next(v))
    })
  }
}
