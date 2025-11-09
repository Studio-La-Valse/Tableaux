import type { InputIteratorsAsync } from '../../core/input-iterators-async'
import type { NodeClass } from '../graph-node-definition'
import DynamicComponentPanel from '@/components/graph/Panels/DynamicComponentPanel.vue'
import { GraphNode } from '@/graph/core/graph-node'
import { useGraphNodeRegistry } from '@/stores/use-graph-node-registry'
import { GraphNodePanel, GraphNodeType } from '../decorators'

export const IOTypes = ['number', 'string', 'boolean', 'object', 'unknown'] as const

export type IOType = (typeof IOTypes)[number]

export type NodeIO = {
  name: string
  type: IOType
}

export type CustomNodeDefinition = {
  path: string[]
  inputs: NodeIO[]
  outputs: NodeIO[]
  code: string
}

export function createAndRegisterCustomNode(template: CustomNodeDefinition): void {
  const NodeClass = createCustomNodeClass(template)

  useGraphNodeRegistry().register(NodeClass)
}

export function createCustomNodeClass(template: CustomNodeDefinition): NodeClass {
  @GraphNodeType(...template.path)
  @GraphNodePanel(DynamicComponentPanel)
  class CustomNode extends GraphNode {
    constructor(modelId: string) {
      super(modelId)
      // register inputs
      for (const input of template.inputs) {
        switch (input.type) {
          case 'number':
            this.registerNumberInput(input.name)
            break
          case 'string':
            this.registerStringInput(input.name)
            break
          case 'boolean':
            this.registerBooleanInput(input.name)
            break
          case 'object':
            this.registerObjectInput(input.name)
            break
          default:
            this.registerUnknownInput(input.name)
        }
      }
      // register outputs
      for (const output of template.outputs) {
        switch (output.type) {
          case 'number':
            this.registerNumberOutput(output.name)
            break
          case 'string':
            this.registerStringOutput(output.name)
            break
          case 'boolean':
            this.registerBooleanOutput(output.name)
            break
          case 'object':
            this.registerObjectOutput(output.name)
            break
          default:
            this.registerUnknownOutput(output.name)
        }
      }
    }

    /* eslint-disable no-new-func */
    async solve(inputIterators: InputIteratorsAsync): Promise<void> {
      try {
        const fn = new Function(
          'inputs',
          'outputs',
          'inputIterators',
          `return (async () => { ${template.code} })();`,
        )
        await fn(this.inputs, this.outputs, inputIterators)
      }
      catch (err) {
        throw new Error(`CustomNode error: ${err}`)
      }
    }
  }
  /* eslint-enable no-new-func */

  (CustomNode as NodeClass).__customNodeDefinition = template
  return CustomNode
}
