import { type XY } from '@/models/geometry/xy'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { scaleUniform, type Geometry } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Scale Geometry (Uniform)')
export class ScaleGeometry extends GraphNode {
  private inputGeometry
  private inputCenter
  private inputFactor

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput<Geometry>('Geometry')
    this.inputCenter = this.registerObjectInput<XY>('Center')
    this.inputFactor = this.registerNumberInput('Scale Factor X')

    this.outputGeometry = this.registerObjectOutput<Geometry>('Scaled Geometry')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputGeometry, this.inputCenter, this.inputFactor)
      .forEach(([geom, center, factor]) => {
        const scaled = scaleUniform(geom, center, factor)
        this.outputGeometry.next(scaled)
      })
  }
}
