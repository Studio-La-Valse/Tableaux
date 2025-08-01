import { assertIsColorARGB } from '@/models/geometry/color-rgb'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { assertIsShape, type Shape } from '@/models/geometry/geometry'
import type { Stroke } from '@/models/geometry/stroke'

@GraphNodeType('Geometry', 'Set Stroke')
export class SetStroke extends GraphNode {
  private inputGeometry
  private color
  private strokeWidth

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')
    this.color = this.registerObjectInput('Color')
    this.strokeWidth = this.registerNumberInput('Stroke Width')

    this.outputGeometry = this.registerObjectOutput<Shape & Stroke>('Geometry with stroke')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputGeometry, this.color, this.strokeWidth)
      .forEach(([_geom, _stroke, strokeWidth]) => {
        const geom = assertIsShape(_geom)
        const stroke = assertIsColorARGB(_stroke)

        const withStroke = {
          ...geom,
          stroke,
          strokeWidth,
        }
        this.outputGeometry.next(withStroke)
      })
  }
}
