import type { ColorARGB } from '@/geometry/color'
import { isValidHexColor, toColorARGB } from '@/geometry/color-hex'
import { GraphNodePanel, GraphNodeType } from '../../decorators'
import ColorPickerPanel from '@/components/graph/Panels/ColorPickerPanel.vue'
import { Emitter, type EmitterKind } from '@/graph/core/emitter'

@GraphNodeType('Geometry', 'Color', 'Color Picker')
@GraphNodePanel(ColorPickerPanel)
export class ColorPicker extends Emitter<string> {
  public type: EmitterKind = 'color'

  private output

  constructor(id: string, path: string[]) {
    super(id, path, '#903c3c')

    this.output = this.registerObjectOutput<ColorARGB>('Color')
  }

  protected async solve(): Promise<void> {
    if (!isValidHexColor(this.data.value)) throw new Error('Expected valid hex format.')

    const argb = toColorARGB(this.data.value)
    this.output.next(argb)
  }
}
