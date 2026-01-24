export class Enumerable<T> implements Iterable<T> {
  constructor(private readonly source: Iterable<T>) {}

  [Symbol.iterator](): Iterator<T> {
    return this.source[Symbol.iterator]()
  }

  map<U>(fn: (item: T) => U): Enumerable<U> {
    const src = this.source
    return new Enumerable<U>(function* () {
      for (const item of src) {
        yield fn(item)
      }
    }())
  }

  where(fn: (item: T) => boolean): Enumerable<T> {
    const src = this.source
    return new Enumerable<T>(function* () {
      for (const item of src) {
        if (fn(item))
          yield item
      }
    }())
  }

  forEach(fn: (item: T) => void): void {
    for (const item of this.source) {
      fn(item)
    }
  }

  toArray(): T[] {
    return [...this.source]
  }
}
