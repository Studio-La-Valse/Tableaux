import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type Geometry } from '@/models/geometry/geometry'
import type { ColorARGB } from '@/models/geometry/color'
import type { Fill } from '@/models/geometry/fill'

@GraphNodeType('Geometry', 'Set Fill')
export class SetFill extends GraphNode {
  private inputGeometry
  private color

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput<Geometry>('Geometry')
    this.color = this.registerObjectInput<ColorARGB>('Color')

    this.outputGeometry = this.registerObjectOutput<Geometry & Fill>('Geometry with fill')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputGeometry, this.color).forEach(([geom, fill]) => {
      const withFill = {
        ...geom,
        fill,
      }
      this.outputGeometry.next(withFill)
    })
  }
}
