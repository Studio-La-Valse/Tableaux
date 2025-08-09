import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/geometry/xy'
import { deconstruct as deconstructEllipse } from '@/geometry/ellipse'
import { assertIsShape, isOfShapeKind } from '@/geometry/shape'

@GraphNodeType('Geometry', 'Deconstruct Ellipse')
export class DeconstructEllipse extends GraphNode {
  private inputCircle

  private outputOrigin
  private outputRadiusX
  private outputRadiusY
  private outputRotation
  private outputArea
  private outputCircumference

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputCircle = this.registerObjectInput('Circle')

    this.outputOrigin = this.registerObjectOutput<xy>('Origin')
    this.outputRadiusX = this.registerNumberOutput('Radius X')
    this.outputRadiusY = this.registerNumberOutput('Radius Y')
    this.outputRotation = this.registerNumberOutput('Rotation')
    this.outputArea = this.registerNumberOutput('Area')
    this.outputCircumference = this.registerNumberOutput('Circumference')
  }

  protected async solve(): Promise<void> {
    inputIterators
      .cycleValues(this.inputCircle)
      .map((v) => v.map((w) => assertIsShape(w)))
      .map((v) =>
        v.map((w) => {
          if (!isOfShapeKind(w, ['circle', 'ellipse'])) {
            throw new Error(`Unknown geometry type, expected 'circle' or 'ellipse', got ${w.kind}`)
          }
          return w
        }),
      )
      .forEach(([geom]) => {
        const { origin, radiusX, radiusY, rotation, area, circumference } = deconstructEllipse(geom)

        this.outputOrigin.next(origin)
        this.outputRadiusX.next(radiusX)
        this.outputRadiusY.next(radiusY)
        this.outputRotation.next(rotation)
        this.outputArea.next(area)
        this.outputCircumference.next(circumference)
      })
  }
}
