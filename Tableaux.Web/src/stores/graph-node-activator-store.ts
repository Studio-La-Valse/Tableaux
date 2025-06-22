import type { GraphNode } from '@/models/graph/core/graph-node'
import { NumberEmitter } from '@/models/graph/graph-nodes/emitters/number-emitter'
import { TextEmitter } from '@/models/graph/graph-nodes/emitters/text-emitter'
import { Logger } from '@/models/graph/graph-nodes/generic/logger'
import { Merge } from '@/models/graph/graph-nodes/generic/merge'
import { RepeatShortest } from '@/models/graph/graph-nodes/generic/repeat-shortest'
import { RepeatUntil } from '@/models/graph/graph-nodes/generic/repeat-until'
import { TrimLongest } from '@/models/graph/graph-nodes/generic/trim-longest'
import { WrapShortest } from '@/models/graph/graph-nodes/generic/wrap-shortest'
import { XY } from '@/models/graph/graph-nodes/geometry/xy'
import { Add } from '@/models/graph/graph-nodes/math/add'
import { Square } from '@/models/graph/graph-nodes/math/square'
import { defineStore } from 'pinia'

export const useGraphNodeActivatorCollection = defineStore('graph-node-activator-store', () => {
  const activatorTree = new ActivatorGroup('root')

  function register(path: string[], activate: (id: string, path: string[]) => GraphNode) {
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
      tree.activators.push(new Activator(path[path.length - 1], (id) => activate(id, path)))
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

  const registerDefault = () => {
    register(['Emitters', 'Number'], (id, path) => new NumberEmitter(id, path))
    register(['Emitters', 'Text'], (id, path) => new TextEmitter(id, path))

    register(['Generic', 'Logger'], (id, path) => new Logger(id, path))
    register(['Generic', 'Merge'], (id, path) => new Merge(id, path))
    register(['Generic', 'Repeat Shortest'], (id, path) => new RepeatShortest(id, path))
    register(['Generic', 'Trim Longest'], (id, path) => new TrimLongest(id, path))
    register(['Generic', 'Wrap Shortest'], (id, path) => new WrapShortest(id, path))
    register(['Generic', 'Repeat Until'], (id, path) => new RepeatUntil(id, path))

    register(['Math', 'Add'], (id, path) => new Add(id, path))
    register(['Math', 'Square'], (id, path) => new Square(id, path))

    register(['Geometry', 'XY'], (id, path) => new XY(id, path))
  }

  return { getFromPath, getAll, register, registerDefault }
})

class Activator {
  constructor(
    public name: string,
    public activate: (id: string) => GraphNode,
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
