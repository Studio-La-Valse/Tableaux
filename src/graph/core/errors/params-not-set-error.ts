export class ParamsNotSetError extends Error {
  constructor() {
    super('Params has not been set.')
    this.name = 'ParamsNotSetError'
  }
}
