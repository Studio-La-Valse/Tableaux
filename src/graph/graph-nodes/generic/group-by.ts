import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('Generic', 'Group by')
export default class GroupBy extends GraphNode {
  private inputObject;
  private inputKey;
  private outputItemGroupValue;
  private outputItemGroupIndex;
  private outputDistinctGroupValue;
  private outputDistinctGroupIndex;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputObject = this.registerObjectInput('Objects');
    this.inputKey = this.registerStringInput('Key');
    this.outputItemGroupValue = this.registerUnknownOutput('Group value (per object)');
    this.outputItemGroupIndex = this.registerNumberOutput('Group index (per object)');
    this.outputDistinctGroupValue = this.registerUnknownOutput('Distinct group values');
    this.outputDistinctGroupIndex = this.registerNumberOutput('Distinct group indices');
  }

  protected async solve(iterators: InputIteratorsAsync): Promise<void> {
    const [key] = iterators.singletonOnly(this.inputKey);

    if (!key) {
      throw new Error('GroupBy: key input is required');
    }

    const groupMap = new Map<string | number, number>();
    let nextGroupIndex = 0;

    for await (const object of iterators.createGenerator(this.inputObject)) {
      if (!(key in object)) {
        throw new Error(`GroupBy: key "${key}" not found in object`);
      }

      const value = object[key];
      if (!this.isValidGroupKey(value)) {
        throw new Error(
          `GroupBy: value for key "${key}" must be string or number, got ${typeof value}`
        );
      }

      // Emit per-object group value
      this.outputItemGroupValue.next(value);

      // Assign group index if first time seeing this value
      if (!groupMap.has(value)) {
        groupMap.set(value, nextGroupIndex++);
      }

      // Emit per-object group index
      this.outputItemGroupIndex.next(groupMap.get(value)!);
    }

    // Emit distinct groups
    for (const [groupValue, groupIndex] of groupMap) {
      this.outputDistinctGroupValue.next(groupValue);
      this.outputDistinctGroupIndex.next(groupIndex);
    }
  }

  private isValidGroupKey(value: unknown): value is string | number | symbol {
    return typeof value === 'string' || typeof value === 'number';
  }
}
