import type { SolverDouble } from '../../solver'

export class AddSolver implements SolverDouble<number, number, number> {
  Solve(data1: number, data2: number): number {
    const result = data1 + data2
    return result
  }
}
