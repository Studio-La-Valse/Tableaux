export class ParamsAlreadySetError extends Error {
  constructor() {
    super('Params has already been set.');
    this.name = 'ParamsAlreadySetError';
  }
}
