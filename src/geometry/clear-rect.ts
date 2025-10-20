import type { Rectangle } from './rectangle';
import type { BaseShape } from './shape';

export type ClearRectShape = BaseShape & Rectangle & { kind: 'clear-rect' };
