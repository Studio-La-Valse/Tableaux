import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import { deconstruct, type Circle as circle } from '@/models/geometry/circle'

@GraphNodeType('Geometry', 'Deconstruct Circle')
export class DeconstructCircle extends GraphNode {
  private inputCircle

  private outputOrigin
  private outputRadius
  private outputRotation
  private outputArea
  private outputCircumference

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputCircle = this.registerObjectInput<circle>('Circle')

    this.outputOrigin = this.registerObjectOutput<xy>('Origin')
    this.outputRadius = this.registerNumberOutput('Radius')
    this.outputRotation = this.registerNumberOutput('Rotation')
    this.outputArea = this.registerNumberOutput('Area')
    this.outputCircumference = this.registerNumberOutput('Circumference')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputCircle).forEach(([circle]) => {
      if (circle.kind !== 'circle') throw new Error(`Expected circle, got ${circle.kind}`)

      const { origin, radius, rotation, area, circumference } = deconstruct(circle)

      this.outputOrigin.next(origin)
      this.outputRadius.next(radius)
      this.outputRotation.next(rotation)
      this.outputArea.next(area)
      this.outputCircumference.next(circumference)
    })
  }
}
