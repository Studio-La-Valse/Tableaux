export class Component{
    protected *zip<T extends unknown[]>(...iterables: { [K in keyof T]: Iterable<T[K]> }): Generator<T, void, unknown> {
    // Convert each iterable into an array for easy indexing
    const arrays = iterables.map(iterable => Array.from(iterable));
    const maxLength = Math.max(...arrays.map(arr => arr.length));

    for (let i = 0; i < maxLength; i++) {
      // Wrap-around using modulo indexing for shorter iterables
      yield arrays.map(arr => arr[i % arr.length]) as T;
    }
  }
}
