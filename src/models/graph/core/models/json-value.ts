export type JsonPrimitive = string | number | boolean | null

export type JsonArray = JsonValue[]

export interface JsonObject {
  [key: string]: JsonValue
}

export function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export function isJsonValue(value: unknown): value is JsonValue {
  const isPrimitive =
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null

  const isArray = Array.isArray(value) && value.every(isJsonValue)

  const isObject =
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(isJsonValue)

  return isPrimitive || isArray || isObject
}
