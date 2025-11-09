import type { Component } from 'vue'
import type { NodeClass } from './graph-node-definition'
import 'reflect-metadata'

export const graphNodeTypes: Array<NodeClass> = []

export function GraphNodeType(...category: string[]) {
  return function (target: NodeClass) {
    target.__graphNodePath = category

    graphNodeTypes.push(target)
  }
}

export function GraphNodePanel(component: Component) {
  return function (target: NodeClass) {
    target.__graphNodePanel = component
  }
}
