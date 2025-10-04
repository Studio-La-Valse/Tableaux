export class InvalidRemovalIndexError extends Error {
  constructor() {
    super('Provided index does not reach params type input.');
    this.name = 'InvalidRemovalIndexError';
  }
}
