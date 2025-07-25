import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'

@GraphNodeType('Geometry', 'Deconstruct XY')
export class DeconstructXY extends GraphNode {
  private inputXY

  private outputX
  private outputY
  private outputMagnitude
  private outputAngle

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputXY = this.registerObjectInput<xy>('XY')

    this.outputX = this.registerNumberOutput('X')
    this.outputY = this.registerNumberOutput('Y')
    this.outputMagnitude = this.registerNumberOutput('Magnitude')
    this.outputAngle = this.registerNumberOutput('Angle (Radians)')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputXY).forEach(([xy]) => {
      const { x, y } = xy
      const magnitude = Math.sqrt(x * x + y * y)
      const angle = Math.atan2(y, x)

      this.outputX.next(x)
      this.outputY.next(y)
      this.outputMagnitude.next(magnitude)
      this.outputAngle.next(angle)
    })
  }
}
