import type { BaseShape } from './shape';
import type { XY } from './xy';

// Quadratic Bézier: start → control → end
export type QuadraticShape = BaseShape & {
  kind: 'quadratic';
  start: XY;
  control: XY;
  end: XY;
};
