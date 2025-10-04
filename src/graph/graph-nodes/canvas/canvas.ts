import { useDesignCanvasStore } from '@/stores/use-design-canvas-store';
import { GraphNode } from '../../core/graph-node';
import { GraphNodeType } from '../decorators';
import { assertIsShape } from '@/geometry/shape';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { BitmapPainter } from '@/bitmap-painters/bitmap-painter';

@GraphNodeType('Canvas', 'Canvas')
export class Canvas extends GraphNode {
  private input;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input =
      this.registerObjectInput('Drawable Elements').validate(assertIsShape);
  }

  public arm(): void {
    super.arm();

    this.getPainter().finish();
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const painter = this.getPainter();
    for await (const v of inputIterators.createGenerator(this.input)) {
      painter.draw(v);
    }

    painter.finish();
  }

  public onDestroy(): void {
    super.onDestroy();

    const painter = this.getPainter();
    painter.finish();
  }

  private getPainter(): BitmapPainter {
    const { canvasRef, dimensions } = useDesignCanvasStore();
    if (!canvasRef) {
      throw new Error('A design canvas has not been initialized.');
    }

    const painter = BitmapPainter.init(canvasRef, dimensions.x, dimensions.y);
    return painter;
  }
}
