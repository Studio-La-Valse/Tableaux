import type { GraphNode } from '@/graph/core/graph-node';
import { validateNodePathParts } from '@/graph/core/graph-node-path';
import type { GraphNodeDefinition } from '@/graph/graph-nodes/graph-node-definition';
import {
  createCustomNode,
  type CustomNodeDefinition,
} from '@/graph/graph-nodes/json/dynamic-graph-node';
import { defineStore } from 'pinia';

export const useGraphNodeRegistry = defineStore('graph-node-registry', () => {
  const activatorTree = new ActivatorGroup('root');

  function register(definition: GraphNodeDefinition) {
    let tree = activatorTree;

    const { errors, sanitized } = validateNodePathParts(definition.category);
    if (errors.length) {
      throw Error(`Invalid Node Path: ${errors[0]}`);
    }

    sanitized.slice(0, -1).forEach((segment) => {
      let branch = tree.findChild(segment);
      if (!branch) {
        branch = new ActivatorGroup(segment);
        tree.children.push(branch);
      }
      tree = branch;
    });

    const leaf = sanitized[sanitized.length - 1];
    const existing = tree.findActivator(leaf);

    if (existing) {
      throw Error(
        `A node with the path ${existing.definition.category} is already registered. No overrides allowed.`
      );
    }

    tree.activators.push(new Activator(leaf, definition));
  }

  function loadCustomDefinitions(defs: CustomNodeDefinition[]) {
    _clearCustomDefinitions();
    defs.forEach((def) => createCustomNode(def)); // automatically registers NodeClass with template
  }

  function _clearCustomDefinitions() {
    function traverseAndRemove(group: ActivatorGroup) {
      group.activators = group.activators.filter((a) => !a.definition.customTemplate);
      group.children.forEach(traverseAndRemove);
    }

    traverseAndRemove(activatorTree);
  }

  function getCustomDefinitions() {
    const result: CustomNodeDefinition[] = [];

    function traverse(group: ActivatorGroup) {
      for (const a of group.activators) {
        if (a.definition.customTemplate) {
          result.push(a.definition.customTemplate);
        }
      }
      for (const child of group.children) {
        traverse(child);
      }
    }

    traverse(activatorTree);
    return result;
  }

  /** Returns the activator (definition + NodeClass) from a path */
  function getFromPath(path: string[]): Activator | undefined {
    let tree: ActivatorGroup | undefined = activatorTree;

    for (const segment of path.slice(0, -1)) {
      tree = tree.findChild(segment);
      if (!tree) return undefined;
    }

    return tree.findActivator(path[path.length - 1]);
  }

  /** Returns true if a definition exists at the given path */
  function has(path: string[]): boolean {
    return !!getFromPath(path);
  }

  /** Returns only the definition (not the activator) */
  function getDefinition(path: string[]): GraphNodeDefinition | undefined {
    const a = getFromPath(path);
    return a?.definition;
  }

  /** Get all registered paths */
  function getAll(): string[][] {
    const paths: string[][] = [];

    function traverse(tree: ActivatorGroup, currentPath: string[]) {
      for (const a of tree.activators) {
        paths.push([...currentPath, a.name]);
      }
      for (const child of tree.children) {
        traverse(child, [...currentPath, child.name]);
      }
    }

    traverse(activatorTree, []);
    return paths;
  }

  /** Create an instance from a path */
  function activate(path: string[], id: string): GraphNode {
    const activator = getFromPath(path);
    if (!activator) {
      throw Error(`No graph node registered with path ${path.join('/')}`);
    }
    return new activator.definition.NodeClass(id, path);
  }

  /**
   * Filter activators by name (for search UI).
   */
  function filterTree(group: ActivatorGroup, term: string): ActivatorGroup | null {
    const match = (name: string) => name.toLowerCase().includes(term.toLowerCase());

    const matchedActivators = group.activators.filter((a) => match(a.name));
    const matchedChildren = group.children
      .map((child) => filterTree(child, term))
      .filter(Boolean) as ActivatorGroup[];

    if (matchedActivators.length || matchedChildren.length) {
      const newGroup = new ActivatorGroup(group.name);
      newGroup.activators = matchedActivators;
      newGroup.children = matchedChildren;
      return newGroup;
    }

    return null;
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
  };
});

/** Activator wraps a single node definition under a leaf node */
export class Activator {
  constructor(
    public name: string,
    public definition: GraphNodeDefinition
  ) {}
}

/** A group of categories, holding children and activators */
export class ActivatorGroup {
  public children: ActivatorGroup[] = [];
  public activators: Activator[] = [];

  constructor(public name: string) {}

  findChild(name: string): ActivatorGroup | undefined {
    return this.children.find((c) => c.name === name);
  }

  findActivator(name: string): Activator | undefined {
    return this.activators.find((a) => a.name === name);
  }
}
