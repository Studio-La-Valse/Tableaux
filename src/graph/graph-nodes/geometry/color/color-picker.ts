import type { ColorARGB } from '@/geometry/color'
import { isValidHexColor, toColorARGB } from '@/geometry/color-hex'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Color', 'Color Picker')
export class ColorPicker extends GraphNode {
  private output

  public override data: { value: string } = { value: '#903c3c' }

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerObjectOutput<ColorARGB>('Color')
  }

  public onChange(color: string): void {
    this.arm()
    this.data.value = color
    this.complete()
  }

  protected solve(): void {
    if (!isValidHexColor(this.data.value)) throw new Error('Expected valid hex format.')

    const argb = toColorARGB(this.data.value)
    this.output.next(argb)
  }
}
