import type { EllipticalArc as _EllipticalArc } from '@/geometry/primitives/elliptical-arc'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsXY } from '@/geometry/primitives/xy'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Curve', 'Construct Elliptical Arc')
export class EllipticalArc extends GraphNode {
  private input1
  private input2
  private input3
  private input4
  private input5
  private input6
  private input7
  private outputCircle

  constructor(modelId: string) {
    super(modelId)

    this.input1 = this.registerObjectInput('XY').validate(assertIsXY)
    this.input2 = this.registerNumberInput('Radius X')
    this.input3 = this.registerNumberInput('Radius Y')
    this.input4 = this.registerNumberInput('Rotation')
    this.input5 = this.registerNumberInput('Start Angle')
    this.input6 = this.registerNumberInput('End Angle')
    this.input7 = this.registerBooleanInput('Counter Clockwise', [false])

    this.outputCircle = this.registerObjectOutput<_EllipticalArc>('Circle')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [
      xy,
      radiusX,
      radiusY,
      rotation,
      startAngle,
      endAngle,
      counterclockwise,
    ] of inputIterators.cycleValues(
        this.input1,
        this.input2,
        this.input3,
        this.input4,
        this.input5,
        this.input6,
        this.input7,
      )) {
      const arc = { ...xy, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise }
      this.outputCircle.next(arc)
    }
  }
}
