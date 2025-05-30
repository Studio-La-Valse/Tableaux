export interface SolverSingle<TIn, TOut>{
  Solve(data: TIn): TOut;
}

export interface SolverDouble<TIn, TIn2, TOut>{
  Solve(data1: TIn, data2: TIn2): TOut;
}
