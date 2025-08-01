import { assertIsXY } from '@/models/geometry/xy'
import { GraphNode } from '../../../core/graph-node'
import { inputIterators } from '../../../core/input-iterators'
import { GraphNodeType } from '../../decorators'
import { assertIsGeometry, rotate, type Geometry } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Transform', 'Rotate')
export class SetRotation extends GraphNode {
  private inputGeometry
  private origin
  private angle

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')
    this.origin = this.registerObjectInput('Origin')
    this.angle = this.registerNumberInput('Angle (Radians)')

    this.outputGeometry = this.registerObjectOutput<Geometry>('Rotated Geometry')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputGeometry, this.origin, this.angle)
      .forEach(([_geom, _origin, angle]) => {
        const geom = assertIsGeometry(_geom)
        const origin = assertIsXY(_origin)
        const rotated = rotate(geom, origin, angle)
        this.outputGeometry.next(rotated)
      })
  }
}
