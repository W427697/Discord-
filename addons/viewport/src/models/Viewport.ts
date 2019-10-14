export type Styles = ViewportStyles | ((s: ViewportStyles) => ViewportStyles) | null;

export type ViewportType = 'desktop' | 'mobile' | 'tablet' | 'other';

export interface Viewport {
  name: string;
  styles: Styles;
  type: ViewportType;
  /*
   * @deprecated
   * Deprecated option?
   */
  default?: boolean;
}

export interface ComputedViewport extends Viewport {
  styles: ViewportStyles;
}

export interface ViewportStyles {
  height: string;
  width: string;
}

export interface ViewportMap {
  [key: string]: Viewport;
}
