import type { ColorARGB } from '@/geometry/color'
import type { EmitterKind } from '@/graph/core/emitter'
import ColorPickerPanel from '@/components/graph/Panels/ColorPickerPanel.vue'
import { isValidHexColor, toColorARGB } from '@/geometry/color-hex'
import { Emitter } from '@/graph/core/emitter'
import { GraphNodePanel, GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Color', 'Color Picker')
@GraphNodePanel(ColorPickerPanel)
export class ColorPicker extends Emitter<string> {
  public type: EmitterKind = 'color'

  private output

  constructor(modelId: string) {
    super(modelId, '#903c3c')

    this.output = this.registerObjectOutput<ColorARGB>('Color')
  }

  protected async solve(): Promise<void> {
    if (!isValidHexColor(this.data.value))
      throw new Error('Expected valid hex format.')

    const argb = toColorARGB(this.data.value)
    this.output.next(argb)
  }
}
