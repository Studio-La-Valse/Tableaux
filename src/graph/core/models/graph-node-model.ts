import type { JsonObject } from './json-value';

export type GraphNodeModel = {
  id: string;
  path: string[];
  x: number;
  y: number;
  data?: JsonObject | undefined;
  width?: number | undefined;
  height?: number | undefined;
};
