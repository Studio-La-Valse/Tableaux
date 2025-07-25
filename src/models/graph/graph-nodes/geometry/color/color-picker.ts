import type { ColorARGB } from '@/models/geometry/color'
import { isValidHexColor, toColorARGB } from '@/models/geometry/color-hex'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Color', 'Color Picker')
export class ColorPicker extends GraphNode {
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerObjectOutput<ColorARGB>('Color')
  }

  override onInitialize(): void {
    if (!this.data.value) this.data.value = '#903c3c'
    this.solve()
  }

  public onChange(color: string): void {
    this.arm()
    this.data.value = color
    this.complete()
  }

  protected solve(): void {
    if (!(typeof this.data.value === 'string')) throw new Error('Expected string value.')
    if (!isValidHexColor(this.data.value)) throw new Error('Expected valid hex format.')

    const argb = toColorARGB(this.data.value)
    this.output.next(argb)
  }
}
