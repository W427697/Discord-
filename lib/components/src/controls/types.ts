import { ArgType } from '../blocks';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface ControlProps<T> {
  name: string;
  value?: T;
  defaultValue?: T;
  argType?: ArgType;
  onChange: (value: T) => T | void;
  onFocus?: (evt: any) => void;
  onBlur?: (evt: any) => void;
}

export type ArrayValue = string[] | readonly string[];
export interface ArrayConfig {
  separator?: string;
}

export type BooleanValue = boolean;
export interface BooleanConfig {}

export type ColorValue = string;
export interface ColorConfig {
  presetColors?: string[];
}

export type DateValue = Date | number;
export interface DateConfig {}

export type NumberValue = number;
export interface NumberConfig {
  min?: number;
  max?: number;
  step?: number;
}

export type RangeConfig = NumberConfig;

export type ObjectValue = any;
export interface ObjectConfig {
  /**
   * Style of expand/collapse icons. Accepted values are "circle", triangle" or "square".
   *
   * Default: {}
   */
  iconStyle?: 'circle' | 'triangle' | 'square';
  /**
   * Set the indent-width for nested objects.
   *
   * Default: 4
   */
  indentWidth?: number;
  /**
   * When set to true, all nodes will be collapsed by default.
   * Use an integer value to collapse at a particular depth.
   *
   * Default: false
   */
  collapsed?: boolean | number;
  /**
   * When an integer value is assigned, strings will be cut off at that length.
   * Collapsed strings are followed by an ellipsis.
   * String content can be expanded and collapsed by clicking on the string value.
   *
   * Default: false
   */
  collapseStringsAfterLength?: number | false;
  /**
   * When an integer value is assigned, arrays will be displayed in groups by count of the value.
   * Groups are displayed with brakcet notation and can be expanded and collapsed by clickong on the brackets.
   *
   * Default: 100
   */
  groupArraysAfterLength?: number;
  /**
   * When prop is not false, the user can copy objects and arrays to clipboard by clicking on the clipboard icon.
   * Copy callbacks are supported.
   *
   * Default: true
   */
  enableClipboard?: boolean;
  /**
   * When set to true, objects and arrays are labeled with size.
   *
   * Default: true
   */
  displayObjectSize?: boolean;
  /**
   * When set to true, data type labels prefix values.
   *
   * Default: true
   */
  displayDataTypes?: boolean;
  /**
   * Set to true to sort object keys.
   *
   * Default: false
   */
  sortKeys?: boolean;
}

export type OptionsSingleSelection = any;
export type OptionsMultiSelection = any[];
export type OptionsSelection = OptionsSingleSelection | OptionsMultiSelection;
export type OptionsArray = any[];
export type OptionsObject = Record<string, any>;
export type Options = OptionsArray | OptionsObject;
export type OptionsControlType =
  | 'radio'
  | 'inline-radio'
  | 'check'
  | 'inline-check'
  | 'select'
  | 'multi-select';

export interface OptionsConfig {
  options: Options;
  type: OptionsControlType;
}

export interface NormalizedOptionsConfig {
  options: OptionsObject;
}

export type TextValue = string;
export interface TextConfig {}

export type ControlType =
  | 'array'
  | 'boolean'
  | 'color'
  | 'date'
  | 'number'
  | 'range'
  | 'object'
  | OptionsControlType
  | 'text';

export type Control =
  | ArrayConfig
  | BooleanConfig
  | ColorConfig
  | DateConfig
  | NumberConfig
  | ObjectConfig
  | OptionsConfig
  | RangeConfig
  | TextConfig;

export type Controls = Record<string, Control>;
