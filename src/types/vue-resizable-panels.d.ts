declare module 'vue-resizable-panels' {
  import type { DefineComponent } from 'vue';

  export const PanelGroup: DefineComponent<{
    direction?: 'horizontal' | 'vertical';
  }>;

  export const Panel: DefineComponent<{
    defaultSize?: number;
    minSize?: number;
    maxSize?: number;
  }>;

  export const PanelResizeHandle: DefineComponent<Record<string, unknown>>;
}
