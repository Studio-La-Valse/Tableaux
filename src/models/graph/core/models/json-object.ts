import type { JsonValue } from "./json-value";

export interface JsonObject {
  [key: string]: JsonValue;
}
