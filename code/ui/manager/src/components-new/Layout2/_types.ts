export interface Bounds {
  top: number;
  width: number;
  left: number;
  height: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export type PanelPosition = 'right' | 'bottom';

export type IsMobileProps = boolean | null;
export type IsDesktopProps = boolean | null;
