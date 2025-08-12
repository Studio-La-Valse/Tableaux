import { createEllipticalArc, type EllipticalArc as ellipticalArc } from '@/geometry/elliptical-arc'
import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'
import { assertIsXY } from '@/geometry/xy'

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

    this.input1 = this.registerObjectInput('XY').validate(assertIsXY)
    this.input2 = this.registerNumberInput('Radius X')
    this.input3 = this.registerNumberInput('Radius Y')
    this.input4 = this.registerNumberInput('Start Angle')
    this.input5 = this.registerNumberInput('End Angle')
    this.input6 = this.registerBooleanInput('Clockwise')

    this.outputCircle = this.registerObjectOutput<ellipticalArc>('Circle')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy, radiusx, radiusy, start, end, clockwise] of inputIterators.cycleValues(
      this.input1,
      this.input2,
      this.input3,
      this.input4,
      this.input5,
      this.input6,
    )) {
      const arc = createEllipticalArc(xy, { x: radiusx, y: radiusy }, start, end, clockwise)
      this.outputCircle.next(arc)
    }
  }
}
