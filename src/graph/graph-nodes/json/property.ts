import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('JSON', 'Property')
export default class Property extends GraphNode {
  private inputObject;
  private inputProperty;
  private outputValue;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputObject = this.registerObjectInput('Object');
    this.inputProperty = this.registerStringInput('Property');
    this.outputValue = this.registerUnkownOutput('Value');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [o, p] of inputIterators.cycleValues(this.inputObject, this.inputProperty)) {
      const result = o[p];
      if (result === undefined)
        throw new Error(`Property '${p}' not found in object '${JSON.stringify(o)}'`);
      this.outputValue.next(result);
    }
  }
}
