import { assertIsXY } from '@/geometry/xy'
import { GraphNode } from '@/graph/core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { assertIsGeometry, skew, type Geometry } from '@/geometry/geometry'

@GraphNodeType('Geometry', 'Transform', 'Skew')
export class ScaleGeometry extends GraphNode {
  private inputGeometry
  private inputCenter
  private inputFactor

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')
    this.inputCenter = this.registerObjectInput('Center')
    this.inputFactor = this.registerNumberInput('Skew Factor')

    this.outputGeometry = this.registerObjectOutput<Geometry>('Skewed Geometry')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [_geom, _origin, factor] of inputIterators.cycleValues(
      this.inputGeometry,
      this.inputCenter,
      this.inputFactor,
    )) {
      const geom = assertIsGeometry(_geom)
      const origin = assertIsXY(_origin)
      const skewed = skew(geom, origin, { x: factor, y: 0 })
      this.outputGeometry.next(skewed)
    }
  }
}
