// -----------------------------
// Types
// -----------------------------

import type { Rectangle } from '../primitives/rectangle'
import type { XY } from '../primitives/xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { Enumerable } from '@/graph/core/models/enumerable'
import { rectangleOps } from '../primitives/rectangle-ops'
import { xyOps } from '../primitives/xy-ops'

export type QuadLeaf = Rectangle & Readonly<{
  kind: 'leaf'
  points: readonly XY[]
}>

export type QuadInternal = Rectangle & Readonly<{
  kind: 'internal'
  children: readonly [QuadNode, QuadNode, QuadNode, QuadNode] // NW, NE, SW, SE
}>

export type QuadNode = QuadLeaf | QuadInternal

// -----------------------------
// Type Guards
// -----------------------------

export function isQuadNode(node: JsonObject): node is QuadNode {
  return (
    rectangleOps.match(node)
    && 'kind' in node
    && typeof node.kind === 'string'
    && (
      isQuadLeaf(node as Rectangle & { kind: string })
      || isQuadInternal(node as Rectangle & { kind: string })
    )
  )
}

export function isQuadLeaf(node: Rectangle & { kind: string }): node is QuadLeaf {
  return node.kind === 'leaf' && 'points' in node && Array.isArray(node.points) && node.points.every(p => xyOps.match(p))
}

export function isQuadInternal(node: Rectangle & { kind: string }): node is QuadInternal {
  return node.kind === 'internal' && 'children' in node && Array.isArray(node.children) && node.children.every(p => isQuadNode(p))
}

export function cast(object: JsonObject): QuadNode {
  if (!isQuadNode(object)) {
    throw new Error('Object could not be cast to a quad node')
  }

  return {
    ...object,
  }
}

// -----------------------------
// Iterables
// -----------------------------

export function depthFirst(root: QuadNode): Enumerable<QuadNode> {
  return new Enumerable<QuadNode>(function* dfs(node: QuadNode): Iterable<QuadNode> {
    yield node
    if (isQuadInternal(node)) {
      for (const child of node.children) {
        yield* dfs(child)
      }
    }
  }(root))
}

export function breadthFirst(root: QuadNode): Enumerable<QuadNode> {
  return new Enumerable<QuadNode>(function* () {
    const queue: QuadNode[] = [root]
    while (queue.length > 0) {
      const node = queue.shift()!
      yield node
      if (isQuadInternal(node)) {
        queue.push(...node.children)
      }
    }
  }())
}
// -----------------------------
// Root Creation
// -----------------------------

export function createQuadRootFromPoints(
  points: readonly XY[],
  capacity: number,
): QuadNode {
  if (points.length === 0) {
    throw new Error('Cannot create quadtree from empty point set.')
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const p of points) {
    if (p.x < minX)
      minX = p.x
    if (p.y < minY)
      minY = p.y
    if (p.x > maxX)
      maxX = p.x
    if (p.y > maxY)
      maxY = p.y
  }

  const rect: Rectangle = {
    x: minX,
    y: minY,
    width: maxX - minX || 1, // avoid zero width/height
    height: maxY - minY || 1,
  }

  return createQuadRootFromBounds(rect, points, capacity)
}

export function createQuadRootFromBounds(
  rect: Rectangle,
  points: readonly XY[],
  capacity: number,
): QuadNode {
  if (capacity <= 0 || !Number.isFinite(capacity)) {
    throw new Error(`Invalid capacity: ${capacity}`)
  }

  let root: QuadNode = createLeaf(rect)

  for (const p of points) {
    if (!pointInRect(p, rect)) {
      // Defensive: either reject or extend bounds; here we reject
      // throw new Error('Point lies outside root bounds.')
      continue
    }
    root = insert(root, p, capacity)
  }

  return root
}

// -----------------------------
// Core constructors
// -----------------------------

function createLeaf(rect: Rectangle, points: readonly XY[] = []): QuadLeaf {
  return {
    ...rect,
    kind: 'leaf',
    points: [...points],
  }
}

function createInternal(
  rect: Rectangle,
  children: readonly [QuadNode, QuadNode, QuadNode, QuadNode],
): QuadInternal {
  const { x, y, width, height } = rect

  return {
    x,
    y,
    width,
    height,
    kind: 'internal',
    children,
  }
}

// -----------------------------
// Geometry Helpers
// -----------------------------

function pointInRect(p: XY, r: Rectangle): boolean {
  return (
    p.x >= r.x
    && p.y >= r.y
    && p.x < r.x + r.width
    && p.y < r.y + r.height
  )
}

function subdivide(rect: Rectangle): readonly [Rectangle, Rectangle, Rectangle, Rectangle] {
  const { x, y, width, height } = rect

  const halfW = width * 0.5
  const halfH = height * 0.5

  if (halfW <= 0 || halfH <= 0) {
    throw new Error('Cannot subdivide rectangle with non-positive half dimensions.')
  }

  const xMid = x + halfW
  const yMid = y + halfH

  // 0 = NW, 1 = NE, 2 = SW, 3 = SE
  const nw: Rectangle = { x, y, width: halfW, height: halfH }
  const ne: Rectangle = { x: xMid, y, width: halfW, height: halfH }
  const sw: Rectangle = { x, y: yMid, width: halfW, height: halfH }
  const se: Rectangle = { x: xMid, y: yMid, width: halfW, height: halfH }

  return [nw, ne, sw, se]
}

function quadrantIndex(rect: Rectangle, p: XY): number {
  const midX = rect.x + rect.width * 0.5
  const midY = rect.y + rect.height * 0.5

  const east = p.x >= midX
  const south = p.y >= midY

  // 0 = NW, 1 = NE, 2 = SW, 3 = SE
  if (!east && !south)
    return 0
  if (east && !south)
    return 1
  if (!east && south)
    return 2
  return 3
}

// -----------------------------
// Immutable insert
// -----------------------------

function insert(node: QuadNode, p: XY, capacity: number): QuadNode {
  if (isQuadInternal(node)) {
    return insertIntoInternal(node, p, capacity)
  }

  // leaf
  const newPoints = [...node.points, p]

  if (newPoints.length <= capacity) {
    return createLeaf(node, newPoints)
  }

  // promote to internal
  const [nwRect, neRect, swRect, seRect] = subdivide(node)

  let internal: QuadInternal = createInternal(node, [
    createLeaf(nwRect),
    createLeaf(neRect),
    createLeaf(swRect),
    createLeaf(seRect),
  ])

  for (const q of newPoints) {
    internal = insertIntoInternal(internal, q, capacity)
  }

  return internal
}

function insertIntoInternal(node: QuadInternal, p: XY, capacity: number): QuadInternal {
  const idx = quadrantIndex(node, p)
  const updatedChild = insert(node.children[idx], p, capacity)

  const newChildren = node.children.slice() as [QuadNode, QuadNode, QuadNode, QuadNode]
  newChildren[idx] = updatedChild

  return createInternal(node, newChildren)
}

// -----------------------------
// Query Rectangle
// -----------------------------

export function queryRange(node: QuadNode, range: Rectangle): readonly XY[] {
  if (!rectsOverlap(node, range)) {
    return []
  }

  if (isQuadLeaf(node)) {
    return node.points.filter(p => pointInRect(p, range))
  }

  const results: XY[] = []
  for (const child of node.children) {
    results.push(...queryRange(child, range))
  }
  return results
}

function rectsOverlap(a: Rectangle, b: Rectangle): boolean {
  return !(
    a.x + a.width <= b.x
    || b.x + b.width <= a.x
    || a.y + a.height <= b.y
    || b.y + b.height <= a.y
  )
}

// -----------------------------
// Query Circle
// -----------------------------

export function queryCircle(
  node: QuadNode,
  center: XY,
  radius: number,
): readonly XY[] {
  if (radius < 0 || !Number.isFinite(radius)) {
    throw new Error(`Invalid radius: ${radius}`)
  }

  // Quick reject: if the node's bounding box doesn't overlap the circle, skip it
  if (!rectIntersectsCircle(node, center, radius)) {
    return []
  }

  if (isQuadLeaf(node)) {
    return node.points.filter(p => pointInCircle(p, center, radius))
  }

  const results: XY[] = []
  for (const child of node.children) {
    results.push(...queryCircle(child, center, radius))
  }
  return results
}

function pointInCircle(p: XY, c: XY, r: number): boolean {
  const dx = p.x - c.x
  const dy = p.y - c.y
  return dx * dx + dy * dy <= r * r
}

function rectIntersectsCircle(rect: Rectangle, c: XY, r: number): boolean {
  const closestX = clamp(c.x, rect.x, rect.x + rect.width)
  const closestY = clamp(c.y, rect.y, rect.y + rect.height)

  const dx = c.x - closestX
  const dy = c.y - closestY

  return dx * dx + dy * dy <= r * r
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v
}
