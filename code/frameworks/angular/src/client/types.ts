import { Provider, importProvidersFrom } from '@angular/core';
import {
  Parameters as DefaultParameters,
  StoryContext as DefaultStoryContext,
  WebRenderer,
} from '@storybook/types';

export interface NgModuleMetadata {
  /**
   * List of components, directives, and pipes that belong to your component.
   */
  declarations?: any[];
  entryComponents?: any[];
  /**
   * List of modules that should be available to the root Storybook Component and all its children.
   * If you want to register singleton services or if you want to use the forRoot() pattern, please use the `singletons` property instead.
   */
  imports?: any[];
  schemas?: any[];
  /**
   * List of providers that should be available to the root Storybook Component and all its children.
   */
  providers?: any[];
  /**
   * List of environment providers that should be available to the root component and all its children.
   * These providers are passed to the bootstrapApplication function for DI.
   * Pass singleton services and Environment Providers to this list with the importProvidersFrom() helper function or
   * provide-prefixed functions can be used to configure different systems without needing to import NgModules.
   * For example, provideRouter is used in place of RouterModule.forRoot to configure the router
   * For more information of how to use the importProvidersFrom() helper function, please refer to https://angular.io/api/core/importProvidersFrom
   *
   * @example
   *
   * import { provideRouter } from '@angular/router';
   * import { importProvidersFrom } from '@angular/core';
   * import { moduleMetadata } from '@storybook/angular';
   *
   * export default {
   *  title: 'Example',
   *  component: ExampleComponent,
   *  decorators: [
   *   moduleMetadata({
   *    singletons: [
   *     provideRouter(routes),
   *     importProvidersFrom(NgModuleOne.forRoot()),
   *    ],
   *   }),
   *  ],
   * },
   *
   */
  singletons?: Array<Provider | ReturnType<typeof importProvidersFrom>>;
}
export interface ICollection {
  [p: string]: any;
}

export interface StoryFnAngularReturnType {
  /** @deprecated `component` story input is deprecated, and will be removed in Storybook 7.0. */
  component?: any;
  props?: ICollection;
  /** @deprecated `propsMeta` story input is deprecated, and will be removed in Storybook 7.0. */
  propsMeta?: ICollection;
  moduleMetadata?: NgModuleMetadata;
  template?: string;
  styles?: string[];
  userDefinedTemplate?: boolean;
}

/**
 * @deprecated Use `AngularRenderer` instead.
 */
export type AngularFramework = AngularRenderer;
export interface AngularRenderer extends WebRenderer {
  component: any;
  storyResult: StoryFnAngularReturnType;
}

export type Parameters = DefaultParameters & {
  bootstrapModuleOptions?: unknown;
};

export type StoryContext = DefaultStoryContext<AngularRenderer> & { parameters: Parameters };
