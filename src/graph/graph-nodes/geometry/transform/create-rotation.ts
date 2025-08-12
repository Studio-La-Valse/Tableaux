import { assertIsXY } from '@/geometry/xy'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'
import { createRotation, type TransformationMatrix } from '@/geometry/transformation-matrix'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'

@GraphNodeType('Geometry', 'Transform', 'Create Rotation')
export class CreateRotation extends GraphNode {
  private origin
  private angle

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.origin = this.registerObjectInput('Origin').validate(assertIsXY)
    this.angle = this.registerNumberInput('Angle (Radians)')

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Transformation Matrix')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [origin, angle] of inputIterators.cycleValues(this.origin, this.angle)) {
      const rotated = createRotation(origin, angle)
      this.outputGeometry.next(rotated)
    }
  }
}
