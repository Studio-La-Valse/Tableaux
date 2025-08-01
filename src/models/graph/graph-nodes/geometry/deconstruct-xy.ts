import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { assertIsXY, deconstruct } from '@/models/geometry/xy'

@GraphNodeType('Geometry', 'Deconstruct XY')
export class DeconstructXY extends GraphNode {
  private inputXY

  private outputX
  private outputY
  private outputMagnitude
  private outputAngle

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputXY = this.registerObjectInput('XY')

    this.outputX = this.registerNumberOutput('X')
    this.outputY = this.registerNumberOutput('Y')
    this.outputMagnitude = this.registerNumberOutput('Magnitude')
    this.outputAngle = this.registerNumberOutput('Angle (Radians)')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputXY).forEach(([_xy]) => {
      const xy = assertIsXY(_xy)

      const { x, y, magnitude, angle } = deconstruct(xy)

      this.outputX.next(x)
      this.outputY.next(y)
      this.outputMagnitude.next(magnitude)
      this.outputAngle.next(angle)
    })
  }
}
