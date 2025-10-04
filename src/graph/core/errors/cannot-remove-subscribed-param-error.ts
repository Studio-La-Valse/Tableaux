export class CannotRemoveSubscribedParamError extends Error {
  constructor(index: number) {
    super(
      `Cannot remove the input at ${index} because it has an active subscription.`
    );
    this.name = 'CannotRemoveSubscribedParamError';
  }
}
