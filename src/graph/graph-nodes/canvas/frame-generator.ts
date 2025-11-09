import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('Canvas', 'Frame Generator')
export default class FrameGenerator extends GraphNode {
  private inputActive;
  private inputReset;
  private inputDelay;
  private outputFrame;

  public override data: {
    lastFrame: number;
    active: boolean;
    delay: number;
    lastTimestamp: number;
    rafId?: number;
  };

  constructor(modelId: string) {
    super(modelId);

    this.inputActive = this.registerBooleanInput('Active');
    this.inputReset = this.registerBooleanInput('Reset');
    this.inputDelay = this.registerNumberInput('Delay');
    this.outputFrame = this.registerNumberOutput('Frame');

    this.data = {
      lastFrame: 0,
      active: false,
      delay: 16,
      lastTimestamp: 0,
    };
  }

  private loop = (timestamp: number): void => {
    if (!this.data.active) return;

    const elapsed = timestamp - this.data.lastTimestamp;

    if (elapsed >= this.data.delay) {
      this.arm();
      this.data.lastTimestamp = timestamp;
      this.outputFrame.next(this.data.lastFrame);
      this.data.lastFrame++;
      this.complete();
    }

    this.data.rafId = requestAnimationFrame(this.loop);
  };

  private start(): void {
    if (this.data.active) return;

    this.data.active = true;
    this.data.lastTimestamp = performance.now();
    this.data.rafId = requestAnimationFrame(this.loop);
  }

  private reset(): void {
    this.data.active = false;

    if (this.data.rafId) {
      cancelAnimationFrame(this.data.rafId);
      this.data.rafId = undefined;
    }
  }

  override onInitialize(): void {
    super.onInitialize();
    this.reset();
  }

  override onDestroy(): void {
    super.onDestroy();
    this.reset();
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const [active, reset, delay] = inputIterators.singletonOnly(
      this.inputActive,
      this.inputReset,
      this.inputDelay
    );

    if (delay < 1) {
      throw new Error(`Invalid delay: ${delay}, please provide a value larger than 1`);
    }

    this.data.delay = delay;

    if (reset) {
      this.data.lastFrame = 0;
    }

    if (!active) {
      this.reset();
    }

    if (active && !this.data.active) {
      this.start();
    }

    // Output current frame even if not incremented this cycle
    this.outputFrame.next(this.data.lastFrame);
  }
}
