import { assertIsColorARGB } from '@/geometry/color-rgb'
import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'
import { assertIsShape, type Shape } from '@/geometry/shape'
import type { Stroke } from '@/geometry/stroke'

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

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [_geom, _stroke, strokeWidth] of inputIterators.cycleValues(
      this.inputGeometry,
      this.color,
      this.strokeWidth,
    )) {
      const geom = assertIsShape(_geom)
      const stroke = assertIsColorARGB(_stroke)

      const withStroke = {
        ...geom,
        stroke,
        strokeWidth,
      }
      this.outputGeometry.next(withStroke)
    }
  }
}
