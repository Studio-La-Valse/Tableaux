import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import { getCenter, getRadius, type Circle as circle } from '@/models/geometry/circle'

@GraphNodeType('Geometry', 'Deconstruct Circle')
export class DeconstructCircle extends GraphNode {
  private inputCircle

  private outputOrigin
  private outputRadius
  private outputArea
  private outputCircumference

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputCircle = this.registerObjectInput<circle>('Circle')

    this.outputOrigin = this.registerObjectOutput<xy>('Origin')
    this.outputRadius = this.registerNumberOutput('Radius')
    this.outputArea = this.registerNumberOutput('Area')
    this.outputCircumference = this.registerNumberOutput('Circumference')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputCircle).forEach(([circle]) => {
      const origin = getCenter(circle)
      const radius = getRadius(circle)

      const area = Math.PI * radius * radius
      const circumference = 2 * Math.PI * radius

      this.outputOrigin.next(origin)
      this.outputRadius.next(radius)
      this.outputArea.next(area)
      this.outputCircumference.next(circumference)
    })
  }
}
