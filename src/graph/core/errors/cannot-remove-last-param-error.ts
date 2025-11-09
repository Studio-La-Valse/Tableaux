export class CannotRemoveLastParamError extends Error {
  constructor() {
    super('Cannot remove this params type input because none would remain.')
    this.name = 'CannotRemoveLastParamError'
  }
}
