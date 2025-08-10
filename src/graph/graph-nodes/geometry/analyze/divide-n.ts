import { GraphNode } from '@/graph/core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import type { XY } from '@/geometry/xy'
import { assertIsCurveLike, dividen } from '@/geometry/curve-like'

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

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [_geom, n] of inputIterators.cycleValues(this.inputGeometry, this.inputN)) {
      const geom = assertIsCurveLike(_geom)
      const result = dividen(geom, n)

      result.forEach((v) => this.outputGeometry.next(v))
    }
  }
}
