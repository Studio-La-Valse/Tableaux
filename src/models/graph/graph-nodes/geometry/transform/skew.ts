import { type XY } from '@/models/geometry/xy'
import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import { skew, type Geometry } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Transform', 'Skew')
export class ScaleGeometry extends GraphNode {
  private inputGeometry
  private inputCenter
  private inputFactor

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput<Geometry>('Geometry')
    this.inputCenter = this.registerObjectInput<XY>('Center')
    this.inputFactor = this.registerObjectInput<XY>('Skew Factor')

    this.outputGeometry = this.registerObjectOutput<Geometry>('Skewed Geometry')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputGeometry, this.inputCenter, this.inputFactor)
      .forEach(([geom, center, factor]) => {
        const skewed = skew(geom, center, factor)
        this.outputGeometry.next(skewed)
      })
  }
}
