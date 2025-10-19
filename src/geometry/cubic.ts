import type { BaseShape } from './shape';
import type { XY } from './xy';

// Cubic Bézier: start → control1 → control2 → end
export type CubicShape = BaseShape & {
  kind: 'cubic';
  start: XY;
  control1: XY;
  control2: XY;
  end: XY;
};
