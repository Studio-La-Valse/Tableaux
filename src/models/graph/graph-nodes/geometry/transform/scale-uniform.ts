import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import { assertIsGeometry, scaleUniform, type Geometry } from '@/models/geometry/geometry'
import { assertIsXY } from '@/models/geometry/xy'

@GraphNodeType('Geometry', 'Transform', 'Scale (Uniform)')
export class ScaleGeometry extends GraphNode {
  private inputGeometry
  private inputCenter
  private inputFactor

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')
    this.inputCenter = this.registerObjectInput('Center')
    this.inputFactor = this.registerNumberInput('Scale Factor X')

    this.outputGeometry = this.registerObjectOutput<Geometry>('Scaled Geometry')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputGeometry, this.inputCenter, this.inputFactor)
      .forEach(([_geom, _origin, factor]) => {
        const geom = assertIsGeometry(_geom)
        const origin = assertIsXY(_origin)
        const scaled = scaleUniform(geom, origin, factor)
        this.outputGeometry.next(scaled)
      })
  }
}
