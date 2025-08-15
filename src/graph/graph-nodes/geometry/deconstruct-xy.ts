import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'
import { assertIsXY, deconstruct } from '@/geometry/xy'

@GraphNodeType('Geometry', 'Deconstruct XY')
export class DeconstructXY extends GraphNode {
  private inputXY

  private outputX
  private outputY
  private outputMagnitude
  private outputAngle

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputXY = this.registerObjectInput('XY').validate(assertIsXY)

    this.outputX = this.registerNumberOutput('X')
    this.outputY = this.registerNumberOutput('Y')
    this.outputMagnitude = this.registerNumberOutput('Magnitude')
    this.outputAngle = this.registerNumberOutput('Angle (Radians)')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy] of inputIterators.cycleValues(this.inputXY)) {
      const { x, y, magnitude, angle } = deconstruct(xy)

      this.outputX.next(x)
      this.outputY.next(y)
      this.outputMagnitude.next(magnitude)
      this.outputAngle.next(angle)
    }
  }
}
