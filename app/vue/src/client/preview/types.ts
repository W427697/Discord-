import { VueConstructor } from 'vue';

export { RenderContext } from '@storybook/core';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

/** Any options that can be passed into Vue.extend */
export type VueOptions = Exclude<Parameters<VueConstructor['extend']>[0], undefined>;

export type StoryFnVueReturnType = string | VueConstructor | VueOptions;

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}

export const WRAPS = 'STORYBOOK_WRAPS';
export const COMPONENT = 'STORYBOOK_COMPONENT';
export const VALUES = 'STORYBOOK_VALUES';
