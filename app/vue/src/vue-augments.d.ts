import Vue, { ComponentOptions, FunctionalComponentOptions } from 'vue';
import { WRAPS, VALUES, VueOptions } from './client/preview/types';

declare module 'vue' {
  export default interface Vue {
    /** @storybook/vue augment, stores the current values passed in to the story. Values are reactive, so will update story components that use them. */
    [VALUES]: Record<string, any>;
  }

  export interface VueConstructor<V extends Vue = Vue> {
    /** Undocumented Vue API - is set on VueConstructor. */
    _isVue: true;

    /** Undocumented Vue API - gets the options object for the VueConstructor (data, props, etc.) */
    options: VueOptions;
  }

  export interface FunctionalComponentOptions<
    Props = DefaultProps,
    PropDefs = PropsDefinition<Props>
  > {
    /** @storybook/vue augment, stores the component that has been wrapped (the story component) */
    [WRAPS]?: VueConstructor;

    /** @storybook/vue augment, stores the default values to pass in as props, extracted from the props of the story component. */
    [VALUES]?: Record<string, any>;
  }
}
