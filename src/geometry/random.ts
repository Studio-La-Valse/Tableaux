export function splitmix32(seed: number): () => number {
  return function () {
    seed |= 0
    seed = (seed + 0x9E3779B9) | 0
    let t = seed ^ (seed >>> 16)
    t = Math.imul(t, 0x21F0AAAD)
    t = t ^ (t >>> 15)
    t = Math.imul(t, 0x735A2D97)
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296
  }
}

export function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6D2B79F5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
