import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type Geometry } from '@/models/geometry/geometry'
import type { Stroke } from '@/models/geometry/stroke'
import type { ColorARGB } from '@/models/geometry/color'

@GraphNodeType('Geometry', 'Set Stroke')
export class SetStroke extends GraphNode {
  private inputGeometry
  private color
  private strokeWidth

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput<Geometry>('Geometry')
    this.color = this.registerObjectInput<ColorARGB>('Color')
    this.strokeWidth = this.registerNumberInput('Stroke Width')

    this.outputGeometry = this.registerObjectOutput<Geometry & Stroke>('Geometry with stroke')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputGeometry, this.color, this.strokeWidth)
      .forEach(([geom, stroke, strokeWidth]) => {
        const withStroke = {
          ...geom,
          stroke,
          strokeWidth,
        }
        this.outputGeometry.next(withStroke)
      })
  }
}
