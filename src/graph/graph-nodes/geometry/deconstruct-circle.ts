import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY } from '@/geometry/xy'
import { deconstruct } from '@/geometry/circle'
import { assertIsShape, isOfShapeKind } from '@/geometry/geometry'

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

    this.inputCircle = this.registerObjectInput('Circle')

    this.outputOrigin = this.registerObjectOutput<XY>('Origin')
    this.outputRadius = this.registerNumberOutput('Radius')
    this.outputRotation = this.registerNumberOutput('Rotation')
    this.outputArea = this.registerNumberOutput('Area')
    this.outputCircumference = this.registerNumberOutput('Circumference')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputCircle).forEach(([_geom]) => {
      const geom = assertIsShape(_geom)

      if (!isOfShapeKind(geom, ['circle'])) {
        throw new Error(`Unknown geometry type, expected 'circle', got ${geom.kind}`)
      }

      const { origin, radius, rotation, area, circumference } = deconstruct(geom)

      this.outputOrigin.next(origin)
      this.outputRadius.next(radius)
      this.outputRotation.next(rotation)
      this.outputArea.next(area)
      this.outputCircumference.next(circumference)
    })
  }
}
