import { useDesignCanvasStore } from '@/stores/use-design-canvas-store';
import { GraphNode } from '../../core/graph-node';
import { GraphNodeType } from '../decorators';
import { createRectangleShape, type Rectangle } from '@/geometry/rectangle';
import { type XY } from '@/geometry/xy';

@GraphNodeType('Canvas', 'Viewport')
export class Viewport extends GraphNode {
  private output;

  public override data: { dimensions: XY };

  constructor(modelId: string) {
    super(modelId);

    this.output = this.registerObjectOutput<Rectangle>('Viewport');

    this.data = { dimensions: { x: 0, y: 0 } };
  }

  public onInitialize(): void {
    super.onInitialize();

    const viewPort = useDesignCanvasStore();
    this.data = { dimensions: viewPort.dimensions };
  }

  public onChange(newValue: XY): void {
    this.data.dimensions = newValue;

    this.arm();
    this.complete();
  }

  protected async solve(): Promise<void> {
    const rectangle = createRectangleShape(
      { x: 0, y: 0 },
      this.data.dimensions.x,
      this.data.dimensions.y
    );
    this.output.next(rectangle);
  }
}
