export type JsonPrimitive = string | number | boolean

export type JsonArray = JsonValue[] | readonly JsonValue[]

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

// ==== Json Struct (immutable json values and objects)

declare const jsonStructBrand: unique symbol

export type JsonStruct = JsonValue & {
  readonly [jsonStructBrand]: true
}

function deepFreeze<T extends JsonValue>(value: T, seen = new WeakSet()): T {
  if (value === null || typeof value !== 'object') {
    return value
  }

  if (seen.has(value)) {
    return value
  }
  seen.add(value)

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      deepFreeze(value[i], seen)
    }
  }
  else {
    for (const key of Object.keys(value)) {
      deepFreeze((value as any)[key], seen)
    }
  }

  return Object.freeze(value)
}

export function asJsonStruct<T extends JsonValue>(value: T): JsonStruct {
  if (!isJsonValue(value)) {
    throw new Error('Value is not valid JSON')
  }

  // Freeze in place (safe because JSON has no functions or prototypes)
  const frozen = deepFreeze(value)

  return frozen as JsonStruct
}

export function isJsonStruct(value: unknown): value is JsonStruct {
  return (
    typeof value === 'object'
    && value !== null
    && (value as any)[jsonStructBrand] === true
  )
}

export function updateStruct<T extends JsonStruct, U extends JsonValue>(
  struct: T,
  updates: U,
): JsonStruct {
  const clone = cloneJson(struct)
  Object.assign(clone as any, updates)
  return asJsonStruct(clone)
}
