import type { GraphNode } from '@/models/graph/core/graph-node'
import { defineStore } from 'pinia'

export const useGraphNodeActivatorCollection = defineStore('graph-node-activator-store', () => {
  const activatorTree = new ActivatorGroup('root')

  function register(path: string[], activate: () => GraphNode) {
    let tree = activatorTree

    path.slice(0, -1).forEach((segment) => {
      let branch = tree.findChild(segment)

      if (!branch) {
        branch = new ActivatorGroup(segment)
        tree.children.push(branch)
      }

      tree = branch // Move deeper into the hierarchy
    })

    if (!tree.findActivator(path[path.length - 1])) {
      tree.activators.push(new Activator(path[path.length - 1], activate))
    }
  }

  function getFromPath(path: string[]): Activator | undefined {
    let tree = activatorTree

    for (const segment of path.slice(0, -1)) {
      const branch = tree.findChild(segment)
      if (!branch) {
        return undefined // Path not found
      }
      tree = branch // Move deeper into the hierarchy
    }

    return tree.findActivator(path[path.length - 1])
  }

  function getAll(): string[][] {
    const paths: string[][] = []

    function traverse(tree: ActivatorGroup, currentPath: string[]): void {
      // Add activators at the current level
      for (const activator of tree.activators) {
        paths.push([...currentPath, activator.name])
      }

      // Recursively traverse children
      for (const child of tree.children) {
        const childPath = [...currentPath, child.name]
        traverse(child, childPath)
      }
    }

    traverse(activatorTree, [])
    return paths
  }

  return { getFromPath, getAll, register }
})

class Activator {
  constructor(
    public name: string,
    public activate: () => GraphNode,
  ) {}
}

class ActivatorGroup {
  public children: ActivatorGroup[] = []
  public activators: Activator[] = []

  constructor(public name: string) {}

  findChild(name: string): ActivatorGroup | undefined {
    return this.children.find((e) => e.name === name)
  }

  findActivator(name: string): Activator | undefined {
    return this.activators.find((e) => e.name === name)
  }
}
