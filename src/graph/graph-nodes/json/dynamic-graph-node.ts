export const IOTypes = ['number', 'string', 'boolean', 'object', 'unknown'] as const;

export type IOType = (typeof IOTypes)[number];

export type NodeIO = {
  name: string;
  type: IOType;
};

export type CustomNodeDefinition = {
  name: string;
  inputs: NodeIO[];
  outputs: NodeIO[];
  code: string;
};

import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '../../core/input-iterators-async';
import { useCustomNodeRegistry } from '@/stores/use-custom-node-registry-store';

export function createCustomNode(def: CustomNodeDefinition) {
  class CustomNode extends GraphNode {
    override data: CustomNodeDefinition = def;

    constructor(id: string, path: string[]) {
      super(id, path);

      // Register inputs
      for (const input of def.inputs) {
        switch (input.type) {
          case 'number':
            this.registerNumberInput(input.name);
            break;
          case 'string':
            this.registerStringInput(input.name);
            break;
          case 'object':
            this.registerObjectInput(input.name);
            break;
          case 'boolean':
            this.registerBooleanInput(input.name);
            break;
          default:
            this.registerUnknownInput(input.name);
        }
      }

      // Register outputs
      for (const output of def.outputs) {
        switch (output.type) {
          case 'number':
            this.registerNumberOutput(output.name);
            break;
          case 'string':
            this.registerStringOutput(output.name);
            break;
          case 'object':
            this.registerObjectOutput(output.name);
            break;
          case 'boolean':
            this.registerBooleanOutput(output.name);
            break;
          default:
            this.registerUnknownOutput(output.name);
        }
      }
    }

    async solve(inputIterators: InputIteratorsAsync): Promise<void> {
      const inputs = this.inputs;
      const outputs = this.outputs;

      const registry = useCustomNodeRegistry();
      const def = registry.get(this.data.name);
      if (!def) {
        throw Error(`Custom node with definition name ${this.data.name} is not registered.`);
      }

      try {
        const fn = new Function(
          'inputs',
          'outputs',
          'inputIterators',
          `return (async () => { ${def.code} })();`
        );
        await fn(inputs, outputs, inputIterators);
      } catch (err) {
        throw new Error(`CustomNode: Error executing user code - ${err}`);
      }
    }
  }

  return CustomNode;
}
