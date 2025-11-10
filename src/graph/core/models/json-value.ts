export type JsonPrimitive = string | number | boolean

export type JsonArray = JsonValue[]

export type JsonObject = {
  [key: string]: JsonValue
}

export function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export function isJsonValue(value: unknown): value is JsonValue {
  const isPrimitive
    = typeof value === 'string'
      || typeof value === 'number'
      || typeof value === 'boolean'
      || value === null

  const isArray = Array.isArray(value) && value.every(isJsonValue)

  const isObject
    = typeof value === 'object'
      && value !== null
      && !Array.isArray(value)
      && Object.values(value).every(isJsonValue)

  return isPrimitive || isArray || isObject
}

export function cloneJson<T extends JsonValue>(value: T, seen = new WeakMap()): T {
  // Primitive or null → return as-is
  if (value === null || typeof value !== 'object') {
    return value
  }

  // Handle circular references
  if (seen.has(value as object)) {
    return seen.get(value as object)
  }

  // Handle arrays
  if (Array.isArray(value)) {
    const clonedArray: unknown[] = []
    seen.set(value, clonedArray)

    for (let i = 0; i < value.length; i++) {
      clonedArray[i] = cloneJson(value[i], seen)
    }

    return clonedArray as T
  }

  // Handle plain objects
  const clonedObject: Record<string, unknown> = {}
  seen.set(value as object, clonedObject)

  for (const key in value as Record<string, unknown>) {
    clonedObject[key] = cloneJson((value as any)[key], seen)
  }

  return clonedObject as T
}

export function cloneFrozen<T extends JsonValue>(value: T, seen = new WeakMap()): T {
  // Primitive or null → return as-is
  if (value === null || typeof value !== 'object') {
    return value
  }

  // Handle circular references
  if (seen.has(value as object)) {
    return seen.get(value as object)
  }

  let clone: any

  if (Array.isArray(value)) {
    clone = []
    seen.set(value, clone)

    for (let i = 0; i < value.length; i++) {
      clone[i] = cloneFrozen(value[i], seen)
    }
  }
  else {
    clone = {}
    seen.set(value as object, clone)

    for (const key in value as Record<string, unknown>) {
      clone[key] = cloneFrozen((value as any)[key], seen)
    }
  }

  return Object.freeze(clone)
}
