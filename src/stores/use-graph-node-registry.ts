import type { GraphNode } from '@/graph/core/graph-node'
import type { NodeClass } from '@/graph/graph-nodes/graph-node-definition'
import type { CustomNodeDefinition } from '@/graph/graph-nodes/json/dynamic-graph-node'
import { defineStore } from 'pinia'
import { validateNodePathParts } from '@/graph/core/graph-node-path'
import {
  createAndRegisterCustomNode,

} from '@/graph/graph-nodes/json/dynamic-graph-node'

export const useGraphNodeRegistry = defineStore('graph-node-registry', () => {
  const activatorTree = new ActivatorGroup('root')

  function register(NodeClass: NodeClass) {
    let tree = activatorTree

    const path = NodeClass.__graphNodePath
    if (!path) {
      throw new Error('Trying to register a component that does not have path.')
    }

    const { errors, sanitized } = validateNodePathParts(path)
    if (errors.length) {
      throw new Error(`Invalid Node Path: ${errors[0]}`)
    }

    // Create intermediate groups
    sanitized.slice(0, -1).forEach((segment) => {
      tree = tree.ensureChild(segment)
    })

    const leaf = sanitized[sanitized.length - 1]

    // ✅ Overwrite existing activator instead of rejecting
    tree.activators.set(leaf, new Activator(leaf, NodeClass))
  }

  function loadCustomDefinitions(defs: CustomNodeDefinition[]) {
    _clearCustomDefinitions()
    defs.forEach(def => createAndRegisterCustomNode(def)) // automatically registers NodeClass with template
  }

  function _clearCustomDefinitions() {
    function traverseAndClean(group: ActivatorGroup): boolean {
      // Remove custom activators
      for (const [key, a] of group.activators) {
        if (a.NodeClass.__customNodeDefinition) {
          group.activators.delete(key)
        }
      }

      // Recursively clean children
      for (const [key, child] of group.children) {
        const keep = traverseAndClean(child)
        if (!keep) {
          group.children.delete(key)
        }
      }

      const hasActivators = group.activators.size > 0
      const hasChildren = group.children.size > 0

      if (group === activatorTree)
        return true
      return hasActivators || hasChildren
    }

    traverseAndClean(activatorTree)
  }

  function getCustomDefinitions() {
    const result: CustomNodeDefinition[] = []

    function traverse(group: ActivatorGroup) {
      for (const a of group.activators.values()) {
        if (a.NodeClass.__customNodeDefinition) {
          result.push(a.NodeClass.__customNodeDefinition)
        }
      }
      for (const child of group.children.values()) {
        traverse(child)
      }
    }

    traverse(activatorTree)
    return result
  }

  /** Returns the activator (definition + NodeClass) from a path */
  function getFromPath(path: string[]): Activator | undefined {
    let tree: ActivatorGroup | undefined = activatorTree

    for (const segment of path.slice(0, -1)) {
      tree = tree.getChild(segment)
      if (!tree)
        return undefined
    }

    return tree.getActivator(path[path.length - 1])
  }

  /** Returns true if a definition exists at the given path */
  function has(path: string[]): boolean {
    return !!getFromPath(path)
  }

  /** Returns only the definition (not the activator) */
  function getDefinition(path: string[]): NodeClass | undefined {
    const a = getFromPath(path)
    return a?.NodeClass
  }

  /** Get all registered paths */
  function getAll(): string[][] {
    const paths: string[][] = []

    function traverse(tree: ActivatorGroup, currentPath: string[]) {
      for (const a of tree.activators.values()) {
        paths.push([...currentPath, a.name])
      }
      for (const child of tree.children.values()) {
        traverse(child, [...currentPath, child.name])
      }
    }

    traverse(activatorTree, [])
    return paths
  }

  /** Create an instance from a path */
  function activate(path: string[], modelId: string): GraphNode {
    const activator = getFromPath(path)
    if (!activator) {
      throw new Error(`No graph node registered with path ${path.join('/')}`)
    }
    return new activator.NodeClass(modelId)
  }

  /**
   * Filter activators by name (for search UI).
   */
  function filterTree(group: ActivatorGroup, term: string): ActivatorGroup | null {
    const match = (name: string) => name.toLowerCase().includes(term.toLowerCase())

    const matchedActivators = [...group.activators.values()].filter(a => match(a.name))
    const matchedChildren: ActivatorGroup[] = []

    for (const child of group.children.values()) {
      const filtered = filterTree(child, term)
      if (filtered)
        matchedChildren.push(filtered)
    }

    if (matchedActivators.length || matchedChildren.length) {
      const newGroup = new ActivatorGroup(group.name)
      for (const a of matchedActivators) {
        newGroup.activators.set(a.name, a)
      }
      for (const child of matchedChildren) {
        newGroup.children.set(child.name, child)
      }
      return newGroup
    }

    return null
  }

  return {
    activatorTree,

    register,

    loadCustomDefinitions,
    getCustomDefinitions,

    has,
    getDefinition,
    getAll,
    activate,
    filterTree,
  }
})

/** Activator wraps a single node definition under a leaf node */
export class Activator {
  constructor(
    public name: string,
    public NodeClass: NodeClass,
  ) {}
}

export class ActivatorGroup {
  public children = new Map<string, ActivatorGroup>()
  public activators = new Map<string, Activator>()

  constructor(public name: string) {}

  getChild(name: string): ActivatorGroup | undefined {
    return this.children.get(name)
  }

  getActivator(name: string): Activator | undefined {
    return this.activators.get(name)
  }

  ensureChild(name: string): ActivatorGroup {
    let child = this.children.get(name)
    if (!child) {
      child = new ActivatorGroup(name)
      this.children.set(name, child)
    }
    return child
  }
}
