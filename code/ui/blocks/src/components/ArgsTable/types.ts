import type { Conditional } from '@storybook/types';

// TODO ?
export interface JsDocParam {
  name: string;
  description?: string;
}

export interface JsDocParamDeprecated {
  deprecated?: string;
}

export interface JsDocReturns {
  description?: string;
}

export interface JsDocTags {
  params?: JsDocParam[];
  deprecated?: JsDocParamDeprecated;
  returns?: JsDocReturns;
}

export interface PropSummaryValue {
  summary: string;
  detail?: string;
  required?: boolean;
}

export type PropType = PropSummaryValue;
export type PropDefaultValue = PropSummaryValue;

export interface TableAnnotation {
  type: PropType;
  jsDocTags?: JsDocTags;
  defaultValue?: PropDefaultValue;
  category?: string;
}

/**
 * See https://storybook.js.org/docs/react/api/arg-types#controltype
 */
type ControlType =
  | 'object'
  | 'boolean'
  | 'check'
  | 'inline-check'
  | 'radio'
  | 'inline-radio'
  | 'select'
  | 'multi-select'
  | 'number'
  | 'range'
  | 'file'
  | 'color'
  | 'date'
  | 'text';

interface SBBaseType {
  required?: boolean;
  raw?: string;
}

type SBScalarType = SBBaseType & {
  name: 'boolean' | 'string' | 'number' | 'function' | 'symbol';
};

type SBArrayType = SBBaseType & {
  name: 'array';
  value: SBType;
};
type SBObjectType = SBBaseType & {
  name: 'object';
  value: Record<string, SBType>;
};
type SBEnumType = SBBaseType & {
  name: 'enum';
  value: (string | number)[];
};
type SBIntersectionType = SBBaseType & {
  name: 'intersection';
  value: SBType[];
};
type SBUnionType = SBBaseType & {
  name: 'union';
  value: SBType[];
};
type SBOtherType = SBBaseType & {
  name: 'other';
  value: string;
};

type SBType =
  | SBScalarType
  | SBEnumType
  | SBArrayType
  | SBObjectType
  | SBIntersectionType
  | SBUnionType
  | SBOtherType;

/**
 * See https://storybook.js.org/docs/react/api/arg-types#argtypes
 */
export interface ArgType {
  /**
   * Specify the behavior of the controls addon for the arg.
   * If you specify a string, it's used as the type of the control.
   * If you specify an object, you can provide additional configuration.
   */
  control?:
    | ControlType
    | {
        /**
         * Specifies the type of control used to change the arg value with the controls addon.
         */
        type: ControlType;
        /**
         * When type is 'file', you can specify the file types that are accepted.
         * The value should be a string of comma-separated MIME types.
         */
        accept?: string;
        /**
         * Map options to labels.
         * labels doesn't have to be exhaustive.
         * If an option is not in the object's keys, it's used verbatim.
         */
        labels?: { [option: string]: string };
        /**
         * When type is 'number' or 'range', sets the maximum allowed value.
         */
        max?: number;
        /**
         * When type is 'number' or 'range', sets the minimum allowed value.
         */
        min?: number;
        /**
         * When type is 'color', defines the set of colors that are available in addition to the general color picker.
         * The values in the array should be valid CSS color values.
         */
        presetColors?: string[];
        /**
         * When type is 'number' or 'range', sets the granularity allowed when incrementing/decrementing the value.
         */
        step?: number;
      };
  /**
   * Describe the arg.
   * If you intend to describe the type of the arg, you should use table.type, instead.
   */
  description?: string;
  /**
   * Conditionally render an argType based on the value of another arg or global.
   */
  if?: Conditional;
  /**
   * Map options to values.
   */
  mapping?: { [key: string]: { [option: string]: any } };
  /**
   * The argTypes object uses the name of the arg as the key.
   * By default, that key is used when displaying the argType in Storybook.
   * You can override the displayed name by specifying a name property.
   */
  name?: string;
  /**
   * If the arg accepts a finite set of values, you can specify them with options.
   * If those values are complex, like JSX elements, you can use mapping to map them to string values.
   * You can use control.labels to provide custom labels for the options.
   */
  options?: string[];
  /**
   * Specify how the arg is documented in the ArgTypes doc block, Controls doc block, and Controls addon panel.
   */
  table?: {
    /**
     * Display the argType under a category heading, with the label specified by category.
     */
    category?: string;
    /**
     * The documented default value of the argType.
     * summary is typically used for the value itself, while detail is used for additional information.
     */
    defaultValue?: { summary: string; detail?: string };
    /**
     * Display the argType under a subcategory heading (which displays under the [category] heading), with the label specified by subcategory.
     */
    subcategory?: string;
    /**
     * The documented type of the argType.
     * summary is typically used for the type itself, while detail is used for additional information.
     * If you need to specify the actual, semantic type, you should use `type`, instead.
     */
    type?: { summary?: string; detail?: string };
  };
  /**
   * Specifies the semantic type of the argType.
   * When an argType is inferred, the information from the various tools is summarized in this property,
   * which is then used to infer other properties, like control and table.type.
   *
   * If you only need to specify the documented type, you should use `table.type`, instead.
   */
  type?: SBType | SBType['name'];
  /**
   * @deprecated use `args` instead
   * Define the default value of the argType. Deprecated in favor of defining the arg value directly.
   */
  defaultValue: any;
}

/**
 * ArgTypes specify the behavior of args. By specifying the type of an arg, you constrain the values that it can accept and provide information about args that are not explicitly set (i.e., description).
 * You can also use argTypes to “annotate” args with information used by addons that make use of those args. For instance, to instruct the controls addon to render a color picker, you could specify the 'color' control type.
 * The most concrete realization of argTypes is the ArgTypes doc block (Controls is similar).
 *
 * See https://storybook.js.org/docs/react/api/arg-types
 */
export interface ArgTypes {
  [key: string]: ArgType;
}

export interface Args {
  [key: string]: any;
}

export type Globals = { [name: string]: any };
