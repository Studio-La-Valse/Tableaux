import {
  createEllipticalArc,
  type EllipticalArc as ellipticalArc,
} from '@/models/geometry/elliptical-arc'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { assertIsXY } from '@/models/geometry/xy'

@GraphNodeType('Geometry', 'Elliptical Arc')
export class EllipticalArc extends GraphNode {
  private input1
  private input2
  private input3
  private input4
  private input5
  private input6
  private outputCircle

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerObjectInput('XY')
    this.input2 = this.registerNumberInput('Radius X')
    this.input3 = this.registerNumberInput('Radius Y')
    this.input4 = this.registerNumberInput('Start Angle')
    this.input5 = this.registerNumberInput('End Angle')
    this.input6 = this.registerBooleanInput('Clockwise')

    this.outputCircle = this.registerObjectOutput<ellipticalArc>('Circle')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2, this.input3, this.input4, this.input5, this.input6)
      .forEach(([_xy, radiusx, radiusy, start, end, clockwise]) => {
        const xy = assertIsXY(_xy)

        const arc = createEllipticalArc(xy, { x: radiusx, y: radiusy }, start, end, clockwise)
        this.outputCircle.next(arc)
      })
  }
}
