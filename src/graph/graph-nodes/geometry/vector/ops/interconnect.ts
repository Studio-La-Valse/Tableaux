/* eslint-disable style/no-multi-spaces */
/* eslint-disable antfu/consistent-list-newline */
import type { Line } from '@/geometry/primitives/line'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { xyOps } from '@/geometry/primitives/xy-ops'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'

@GraphNodeType('Geometry', 'Vector', 'Ops', 'Interconnect')
class _ extends GraphNode {
  points
  distance
  lines

  constructor(modelId: string) {
    super(modelId)

    this.points = this.registerObjectInput('Points').validate(xyOps.cast)
    this.distance = this.registerNumberInput('Distance')
    this.lines = this.registerObjectOutput<Line>('Lines')
  }

  protected async solve(iterators: InputIteratorsAsync): Promise<void> {
    const [maxDist] = iterators.singletonOnly(this.distance)
    const n = this.points.payloadLength
    const maxDistSq = maxDist * maxDist

    // ───────────────────────────────────────────────────────────────
    // LARGE SET → SPATIAL HASH
    // ───────────────────────────────────────────────────────────────
    if (n > 200) {
      const cellSize = maxDist
      const grid = new Map<string, number[]>()
      const lines: Line[] = []

      const cellKey = (x: number, y: number): string =>
        `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`

      // Insert points into spatial grid
      for await (const i of iterators.createRange(0, n, 1)) {
        const p = this.points.peek(i)
        const key = cellKey(p.x, p.y)

        let bucket = grid.get(key)
        if (!bucket) {
          bucket = []
          grid.set(key, bucket)
        }
        bucket.push(i)
      }

      const offsets: ReadonlyArray<readonly [number, number]> = [
        [-1, -1], [0, -1], [1, -1],
        [-1,  0], [0,  0], [1,  0],
        [-1,  1], [0,  1], [1,  1],
      ]

      // Check only nearby cells
      for await (const i of iterators.createRange(0, n, 1)) {
        const p = this.points.peek(i)
        const cx = Math.floor(p.x / cellSize)
        const cy = Math.floor(p.y / cellSize)

        for (const [ox, oy] of offsets) {
          const key = `${cx + ox},${cy + oy}`
          const bucket = grid.get(key)
          if (!bucket)
            continue

          for await (const j of iterators.fromArray(bucket)) {
            if (j <= i)
              continue

            const q = this.points.peek(j)
            const dx = p.x - q.x
            const dy = p.y - q.y

            if (dx * dx + dy * dy <= maxDistSq) {
              lines.push({ start: p, end: q })
            }
          }
        }
      }

      for await (const line of iterators.fromArray(lines)) {
        this.lines.next(line)
      }
      return
    }

    // ───────────────────────────────────────────────────────────────
    // SMALL SET → BRUTE FORCE (tight, minimal overhead)
    // ───────────────────────────────────────────────────────────────
    {
      const lines: Line[] = []

      for await (const i of iterators.createRange(0, n, 1)) {
        const p = this.points.peek(i)

        // j starts at i+1 to avoid duplicates
        for await (const j of iterators.createRange(i + 1, n, 1)) {
          const q = this.points.peek(j)
          const dx = p.x - q.x
          const dy = p.y - q.y

          if (dx * dx + dy * dy <= maxDistSq) {
            lines.push({ start: p, end: q })
          }
        }
      }

      for await (const line of iterators.fromArray(lines)) {
        this.lines.next(line)
      }
    }
  }
}
