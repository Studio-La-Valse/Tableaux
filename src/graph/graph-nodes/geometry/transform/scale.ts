import { assertIsXY } from '@/geometry/xy'
import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { assertIsGeometry, scale, type Geometry } from '@/geometry/geometry'

@GraphNodeType('Geometry', 'Transform', 'Scale')
export class ScaleGeometry extends GraphNode {
  private inputGeometry
  private inputCenter
  private inputFactorX
  private inputFactorY

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')
    this.inputCenter = this.registerObjectInput('Center')
    this.inputFactorX = this.registerNumberInput('X Scale Factor')
    this.inputFactorY = this.registerNumberInput('Y Scale Factor')

    this.outputGeometry = this.registerObjectOutput<Geometry>('Scaled Geometry')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputGeometry, this.inputCenter, this.inputFactorX, this.inputFactorY)
      .forEach(([_geom, _origin, x, y]) => {
        const geom = assertIsGeometry(_geom)
        const origin = assertIsXY(_origin)
        const factor = { x, y }
        const scaled = scale(geom, origin, factor)
        this.outputGeometry.next(scaled)
      })
  }
}
