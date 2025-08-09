import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { assertIsGeometry, scaleUniform, type Geometry } from '@/geometry/geometry'
import { assertIsXY } from '@/geometry/xy'

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

  protected async solve(): Promise<void> {
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
