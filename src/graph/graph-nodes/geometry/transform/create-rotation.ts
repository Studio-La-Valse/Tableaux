import { assertIsXY } from '@/geometry/xy'
import { GraphNode } from '../../../core/graph-node'
import { inputIterators } from '../../../core/input-iterators'
import { GraphNodeType } from '../../decorators'
import { createRotation, type TransformationMatrix } from '@/geometry/transformation-matrix'

@GraphNodeType('Geometry', 'Transform', 'Create Rotation')
export class CreateRotation extends GraphNode {
  private origin
  private angle

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.origin = this.registerObjectInput('Origin')
    this.angle = this.registerNumberInput('Angle (Radians)')

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Transformation Matrix')
  }

  protected async solve(): Promise<void> {
    inputIterators.cycleValues(this.origin, this.angle).forEach(([_origin, angle]) => {
      const origin = assertIsXY(_origin)
      const rotated = createRotation(origin, angle)
      this.outputGeometry.next(rotated)
    })
  }
}
