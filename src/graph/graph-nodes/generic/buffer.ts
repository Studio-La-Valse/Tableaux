import type { JsonValue } from '@/graph/core/models/json-value';
import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Generic', 'Buffer')
export class Buffer extends GraphNode {
  private inputValues;
  private inputLength;
  private inputReset;
  private output;

  public override data: { buffer: JsonValue[] } = { buffer: [] };

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputValues = this.registerUnkownInput('Input');
    this.inputLength = this.registerNumberInput('Length');
    this.inputReset = this.registerBooleanInput('Reset');
    this.output = this.registerUnkownOutput('Values');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const [length, reset] = inputIterators.singletonOnly(this.inputLength, this.inputReset);

    if (reset) {
      this.data.buffer.length = 0;
    }

    for await (const [v] of inputIterators.cycleValues(this.inputValues)) {
      this.data.buffer.push(v);

      while (this.data.buffer.length && this.data.buffer.length > length) {
        this.data.buffer.shift();
      }
    }

    for (const v of this.data.buffer) {
      this.output.next(v);
    }
  }
}
