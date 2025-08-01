import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { assertIsShape, type Shape } from '@/geometry/geometry'
import type { Fill } from '@/geometry/fill'
import { assertIsColorARGB } from '@/geometry/color-rgb'

@GraphNodeType('Geometry', 'Set Fill')
export class SetFill extends GraphNode {
  private inputGeometry
  private color

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')
    this.color = this.registerObjectInput('Color')

    this.outputGeometry = this.registerObjectOutput<Shape & Fill>('Geometry with fill')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputGeometry, this.color).forEach(([_geom, _fill]) => {
      const geom = assertIsShape(_geom)
      const fill = assertIsColorARGB(_fill)

      const withFill = {
        ...geom,
        fill,
      }
      this.outputGeometry.next(withFill)
    })
  }
}
