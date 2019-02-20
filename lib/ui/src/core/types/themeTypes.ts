export interface AddonActionsTheme {}

interface Action {
  float: Animation;
  glow: Animation;
  inlineGlow: IGlow;
  jiggle: Animation;
  rotate360: Animation;
}
export interface Animation {
  anim: number;
  name: string;
  styles: string;
  toString: () => string;
}

export interface IGlow extends Animation {
  map?: any;
  next: {
    name: string;
    next?: any;
    styles: string;
  };
}
export interface Color {
  border: string;
  danger: string;
  dark: string;
  darker: string;
  darkest: string;
  gold: string;
  green: string;
  light: string;
  lighter: string;
  lightest: string;
  medium: string;
  mediumdark: string;
  mediumlight: string;
  negative: string;
  orange: string;
  positive: string;
  primary: string;
  purple: string;
  seafoam: string;
  secondary: string;
  tertiary: string;
  ultraviolet: string;
}

export interface Weight {
  black: string;
  bold: string;
  regular: string;
}

export interface Size {
  code: string;
  l1: string;
  l2: string;
  l3: string;
  m1: string;
  m2: string;
  m3: string;
  s1: string;
  s2: string;
  s3: string;
}
export interface Typography {
  size: Size;
  weight: Weight;
}
export interface Theme {
  addonActionsTheme: AddonActionsTheme;
  animation: Animation;
  asideFill: string;
  asideHover: { background: string };
  asideSelected: { background: string; color: string };
  background: {
    app: string;
    appInverse: string;
    positive: string;
    negative: string;
    warning: string;
  };
  barFill: string;
  barSelectedColor: string;
  barTextColor: string;
  brand?: any;
  code: any;
  color: Color;
  dimmedTextColor: string;
  easing: {
    rubber: string;
  };
  inputFill: string;
  layoutMargin: number;
  mainBackground: string;
  mainBorder: string;
  mainBorderColor: string;
  mainBorderRadius: number;
  mainFill: string;
  mainTextColor: string;
  mainTextFace: string;
  mainTextSize: number;
  menuHighlightColor: string;
  monoTextFace: string;
  typography: Typography;
}
