import type {
  ViewMode as ViewModeBase,
  AnnotatedStoryFn,
  Args,
  ArgsEnhancer,
  ArgsFromMeta,
  ArgsStoryFn,
  ArgTypes,
  ArgTypesEnhancer,
  BaseAnnotations,
  ComponentAnnotations,
  ComponentId,
  ComponentTitle,
  Conditional,
  DecoratorApplicator,
  DecoratorFunction,
  Globals,
  GlobalTypes,
  IncludeExcludeOptions,
  InputType,
  LegacyAnnotatedStoryFn,
  LegacyStoryAnnotationsOrFn,
  LegacyStoryFn,
  LoaderFunction,
  Parameters,
  PartialStoryFn,
  PlayFunction,
  PlayFunctionContext,
  Renderer,
  SBArrayType,
  SBEnumType,
  SBIntersectionType,
  SBObjectType,
  SBOtherType,
  SBScalarType,
  SBType,
  SBUnionType,
  SeparatorOptions,
  StepFunction,
  StepLabel,
  StepRunner,
  StoryAnnotations,
  StoryAnnotationsOrFn,
  StoryContext,
  StoryContextForEnhancers,
  StoryContextForLoaders,
  StoryContextUpdate,
  StoryFn,
  StoryId,
  StoryIdentifier,
  StoryKind,
  StoryName,
  StrictArgs,
  StrictArgTypes,
  StrictGlobalTypes,
  StrictInputType,
  Tag,
} from '@storybook/csf';

import type { Addon_OptionsParameter } from './addons';

export type ControlType =
  | 'boolean'
  | 'color'
  | 'date'
  | 'number'
  | 'range'
  | 'object'
  | 'text'
  | 'radio'
  | 'inline-radio'
  | 'check'
  | 'inline-check'
  | 'select'
  | 'file'
  | 'multi-select';

export type InputTypeOverride = InputType & {
  control?:
    | ControlType
    | {
        type: Extract<ControlType, 'number' | 'file'>;
        accept: string;
      }
    | {
        type: Extract<ControlType, 'number' | 'range'>;
        max: number;
        min: number;
        step: number;
      }
    | {
        type: Extract<ControlType, 'color'>;
        presetColors: string[];
      }
    | {
        type: ControlType;
        labels?: { [option: string]: string };
        [key: string]: any;
      };
  mapping?: { [key: string]: { [option: string]: any } };
  table?: {
    category?: string;
    defaultValue?: { summary: string; detail?: string };
    subcategory?: string;
    type?: { summary?: string; detail?: string };
  };
};

export type {
  AnnotatedStoryFn,
  Args,
  ArgsEnhancer,
  ArgsFromMeta,
  ArgsStoryFn,
  ArgTypes,
  ArgTypesEnhancer,
  BaseAnnotations,
  ComponentAnnotations,
  ComponentId,
  ComponentTitle,
  Conditional,
  DecoratorApplicator,
  DecoratorFunction,
  Globals,
  GlobalTypes,
  IncludeExcludeOptions,
  InputTypeOverride as InputType,
  LegacyAnnotatedStoryFn,
  LegacyStoryAnnotationsOrFn,
  LegacyStoryFn,
  LoaderFunction,
  Parameters,
  PartialStoryFn,
  PlayFunction,
  PlayFunctionContext,
  Renderer,
  SBArrayType,
  SBEnumType,
  SBIntersectionType,
  SBObjectType,
  SBOtherType,
  SBScalarType,
  SBType,
  SBUnionType,
  SeparatorOptions,
  StepFunction,
  StepLabel,
  StepRunner,
  StoryAnnotations,
  StoryAnnotationsOrFn,
  StoryContext,
  StoryContextForEnhancers,
  StoryContextForLoaders,
  StoryContextUpdate,
  StoryFn,
  StoryId,
  StoryIdentifier,
  StoryKind,
  StoryName,
  StrictArgs,
  StrictArgTypes,
  StrictGlobalTypes,
  StrictInputType,
  Tag,
};

type OrString<T extends string> = T | (string & {});

export type ViewMode = OrString<ViewModeBase | 'settings'> | undefined;

type Layout = 'centered' | 'fullscreen' | 'padded' | 'none';

export interface StorybookParameters {
  options?: Addon_OptionsParameter;
  /**
   * The layout property defines basic styles added to the preview body where the story is rendered.
   *
   * If you pass `none`, no styles are applied.
   */
  layout?: Layout;
}

export interface StorybookInternalParameters extends StorybookParameters {
  fileName?: string;
  docsOnly?: true;
}

export type Path = string;
