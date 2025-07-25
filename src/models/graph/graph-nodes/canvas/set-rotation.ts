import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type Geometry } from '@/models/geometry/geometry'
import type { Rotation } from '@/models/geometry/rotation'
import type { XY } from '@/models/geometry/xy'

@GraphNodeType('Geometry', 'Set Rotation')
export class SetRotation extends GraphNode {
  private inputGeometry
  private origin
  private angle

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput<Geometry>('Geometry')
    this.origin = this.registerObjectInput<XY>('Origin')
    this.angle = this.registerNumberInput('Angle (Radians)')

    this.outputGeometry = this.registerObjectOutput<Geometry & Rotation>('Rotated Geometry')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputGeometry, this.origin, this.angle)
      .forEach(([geom, origin, angle]) => {
        const rotated = {
          ...geom,
          origin,
          angle,
        }
        this.outputGeometry.next(rotated)
      })
  }
}
