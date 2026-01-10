import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { clear } from '@/bitmap-painters/bitmap-painter'
import { drawableOps } from '@/geometry/primitives/union/drawable/drawable-ops'
import { useDesignCanvasStore } from '@/stores/use-design-canvas-store'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Canvas', 'Canvas')
export class Canvas extends GraphNode {
  private clear
  private input

  constructor(modelId: string) {
    super(modelId)

    this.clear = this.registerBooleanInput('Clear')
    this.input = this.registerObjectInput('Drawable Elements').validate(drawableOps.cast)
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const canvas = this.getCanvasContext()

    const [_clear] = inputIterators.singletonOnly(this.clear)
    if (_clear) {
      clear(canvas)
    }

    for await (const v of inputIterators.createGenerator(this.input)) {
      drawableOps.draw(canvas, v)
    }
  }

  public onDestroy(): void {
    super.onDestroy()

    const canvas = this.getCanvasContext()
    clear(canvas)
  }

  private getCanvasContext(): CanvasRenderingContext2D {
    const { canvasRef } = useDesignCanvasStore()
    const canvas = canvasRef?.getContext('2d')
    if (!canvas) {
      throw new Error('A design canvas has not been initialized.')
    }
    return canvas
  }
}
