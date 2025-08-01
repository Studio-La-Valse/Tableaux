import { assertIsXY } from '@/models/geometry/xy'
import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import { assertIsGeometry, skew, type Geometry } from '@/models/geometry/geometry'

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

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputGeometry, this.inputCenter, this.inputFactor)
      .forEach(([_geom, _origin, factor]) => {
        const geom = assertIsGeometry(_geom)
        const origin = assertIsXY(_origin)
        const skewed = skew(geom, origin, { x: factor, y: 0 })
        this.outputGeometry.next(skewed)
      })
  }
}
