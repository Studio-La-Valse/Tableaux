import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'
import { type XY } from '@/geometry/xy'
import { deconstruct } from '@/geometry/circle'
import { assertIsShape, isOfShapeKind } from '@/geometry/shape'

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

    this.inputCircle = this.registerObjectInput('Circle').validate((v) => {
      const geom = assertIsShape(v)

      if (!isOfShapeKind(geom, ['circle'])) {
        throw new Error(`Unknown geometry type, expected 'circle', got ${geom.kind}`)
      }

      return geom
    })

    this.outputOrigin = this.registerObjectOutput<XY>('Origin')
    this.outputRadius = this.registerNumberOutput('Radius')
    this.outputRotation = this.registerNumberOutput('Rotation')
    this.outputArea = this.registerNumberOutput('Area')
    this.outputCircumference = this.registerNumberOutput('Circumference')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom] of inputIterators.cycleValues(this.inputCircle)) {
      const { origin, radius, rotation, area, circumference } = deconstruct(geom)

      this.outputOrigin.next(origin)
      this.outputRadius.next(radius)
      this.outputRotation.next(rotation)
      this.outputArea.next(area)
      this.outputCircumference.next(circumference)
    }
  }
}
