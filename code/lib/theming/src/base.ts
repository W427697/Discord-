import { transparentize } from 'polished';

export const color = {
  // Official color palette
  primary: '#FF4785', // coral  // Is it time to remove primary and make ocan primary? Or should we make them 'pink', 'blue, etc'?
  secondary: '#029CFD', // ocean // UPDATED
  tertiary: '#FAFBFC', // Used in shortcuts, link, input?
  ancillary: '#22a699', // used at all?

  // Complimentary
  orange: '#FC521F',
  gold: '#FFAE00',
  green: '#66BF3C',
  seafoam: '#37D5D3',
  purple: '#6F2CAC',
  ultraviolet: '#2A0481',

  // Monochrome
  lightest: '#FFFFFF',
  lighter: '#F7FAFC', // object select background
  light: '#EEF3F6', // code background
  mediumlight: '#ECF4F9', // toggle background
  medium: '#D9E8F2', // too blue for medium?
  mediumdark: '#73828C', // icons, tabs, labels, input placeholders, sidebar headings
  dark: '#666666', // NEEDED?
  darker: '#454E54', // keyboard shortcut text * controls table content/headings
  darkest: '#2E3438', // default text

  // For borders
  border: 'hsla(203, 30%, 40%, 0.15)',

  // Status
  positive: '#448028',
  negative: '#D43900',
  warning: '#A15C20',
  critical: '#FFFFFF',

  defaultText: '#2E3438',
  inverseText: '#FFFFFF',
};

export const background = {
  app: '#F5FBFF', // UPDATED
  bar: color.lightest,
  content: color.lightest,
  gridCellSize: 10,
  hoverable: transparentize(0.93, color.secondary), // hover state for items in a list

  // Notification, error, and warning backgrounds
  positive: '#E1FFD4',
  negative: '#FEDED2',
  warning: '#FFF5CF',
  critical: '#FF4400',
};

export const typography = {
  fonts: {
    base: [
      '"Nunito Sans"',
      '-apple-system',
      '".SFNSText-Regular"',
      '"San Francisco"',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(', '),
    mono: [
      'ui-monospace',
      'Menlo',
      'Monaco',
      '"Roboto Mono"',
      '"Oxygen Mono"',
      '"Ubuntu Monospace"',
      '"Source Code Pro"',
      '"Droid Sans Mono"',
      '"Courier New"',
      'monospace',
    ].join(', '),
  },
  weight: {
    regular: 400,
    bold: 700,
    black: 900,
  },
  size: {
    s1: 12,
    s2: 14,
    s3: 16,
    m1: 20,
    m2: 24,
    m3: 28,
    l1: 32,
    l2: 40,
    l3: 48,
    code: 90,
  },
};
