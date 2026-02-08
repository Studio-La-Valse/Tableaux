import type { ColorRGB } from '@/geometry/color/color-rgb'
import type { EmitterKind } from '@/graph/core/emitter'
import ColorPickerPanel from '@/components/graph/Panels/ColorPickerPanel.vue'
import { hexOps } from '@/geometry/color/color-hex-ops'
import { Emitter } from '@/graph/core/emitter'
import { GraphNodePanel, GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Color', 'Color Picker')
@GraphNodePanel(ColorPickerPanel)
export class ColorPicker extends Emitter<string> {
  public type: EmitterKind = 'color'

  private output

  constructor(modelId: string) {
    super(modelId, '#903c3c')

    this.output = this.registerObjectOutput<ColorRGB>('Color')
  }

  protected async solve(): Promise<void> {
    if (!hexOps.match(this.data.value))
      throw new Error('Expected valid hex format.')

    const argb = hexOps.convert.rgb(this.data.value)
    this.output.next(argb)
  }
}
