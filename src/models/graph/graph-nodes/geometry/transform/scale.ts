import { type XY } from '@/models/geometry/xy'
import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import { scale, type Geometry } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Transform', 'Scale')
export class ScaleGeometry extends GraphNode {
  private inputGeometry
  private inputCenter
  private inputFactorX
  private inputFactorY

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput<Geometry>('Geometry')
    this.inputCenter = this.registerObjectInput<XY>('Center')
    this.inputFactorX = this.registerNumberInput('X Scale Factor')
    this.inputFactorY = this.registerNumberInput('Y Scale Factor')

    this.outputGeometry = this.registerObjectOutput<Geometry>('Scaled Geometry')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputGeometry, this.inputCenter, this.inputFactorX, this.inputFactorY)
      .forEach(([geom, center, x, y]) => {
        const factor = { x, y }
        const scaled = scale(geom, center, factor)
        this.outputGeometry.next(scaled)
      })
  }
}
