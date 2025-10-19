import { useDesignCanvasStore } from '@/stores/use-design-canvas-store';
import { GraphNode } from '../../core/graph-node';
import { GraphNodeType } from '../decorators';
import { assertIsShape } from '@/geometry/shape';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { clear, draw, init } from '@/bitmap-painters/bitmap-painter';

@GraphNodeType('Canvas', 'Canvas')
export class Canvas extends GraphNode {
  private input;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input = this.registerObjectInput('Drawable Elements').validate(assertIsShape);
  }

  public arm(): void {
    super.arm();

    const canvas = this.getCanvasContext();
    clear(canvas);
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const canvas = this.getCanvasContext();
    for await (const v of inputIterators.createGenerator(this.input)) {
      draw(canvas, v);
    }
  }

  public onDestroy(): void {
    super.onDestroy();

    const canvas = this.getCanvasContext();
    clear(canvas);
  }

  private getCanvasContext(): CanvasRenderingContext2D {
    const { canvasRef, dimensions } = useDesignCanvasStore();
    if (!canvasRef) {
      throw new Error('A design canvas has not been initialized.');
    }

    const canvas = init(canvasRef, dimensions.x, dimensions.y);
    return canvas;
  }
}
