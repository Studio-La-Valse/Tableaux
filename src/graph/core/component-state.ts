import type { componentStates } from './component-states';

export type ComponentState = (typeof componentStates)[keyof typeof componentStates];
