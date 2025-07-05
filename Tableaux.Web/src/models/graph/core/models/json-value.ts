import type { JsonArray } from "./json-array";
import type { JsonObject } from "./json-object";
import type { JsonPrimitive } from "./json-primitive";

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
